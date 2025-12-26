import { test, expect } from "@playwright/test";

import bibleData from "./mocks/bibles.json" with { type: "json" };
import verseReferenceRomansChapter3Verse23NKJV from "./mocks/verses/NKJV/verse-reference-romans-3-23.json" with { type: "json" };
import verseReferenceRomansChapter3Verse23BSB from "./mocks/verses/BSB/verse-reference-romans-3-23.json" with { type: "json" };
import verseReferenceJohnChapter14Verse6BSB from "./mocks/verses/BSB/verse-reference-john-14-6.json" with { type: "json" };

function findBibleId(abbreviationLocal: string) {
  const bible = bibleData.data.find((bibleData) => {
    return bibleData.abbreviationLocal === abbreviationLocal;
  });

  if (!bible) {
    throw new Error("Failed to find bible by abbreviation");
  }

  return bible.id;
}

const bibleIdNKJV = findBibleId("NKJV");
const bibleIdBSB = findBibleId("BSB");

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/bibles", async (route) => {
    await route.fulfill({ json: bibleData });
  });

  await page.route(
    `**/api/v1/bibles/${bibleIdNKJV}/passages/verse-reference`,
    async (route) => {
      await route.fulfill({ json: verseReferenceRomansChapter3Verse23NKJV });
    },
  );

  await page.route(
    `**/api/v1/bibles/${bibleIdBSB}/passages/verse-reference`,
    async (route) => {
      const postData = route.request().postDataJSON();
      if (postData.verseReference === "Romans 3:23") {
        await route.fulfill({ json: verseReferenceRomansChapter3Verse23BSB });
      } else if (postData.verseReference === "John 14:6") {
        await route.fulfill({ json: verseReferenceJohnChapter14Verse6BSB });
      }
    },
  );
});

test("page load", async ({ page }) => {
  await page.goto("/#/share-the-gospel");

  await expect(page).toHaveTitle(
    /Verses for Sharing the Gospel | Memorize Bible Verses"/,
  );
  await expect(
    page.getByRole("heading", { name: "Share the Gospel" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Bible Translation Selection" }),
  ).toHaveValue(bibleIdNKJV);

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /for all have sinned/,
  );
  await expect(page.locator(".citation")).toHaveText(/New King James Version/);
});

test("back button", async ({ page }) => {
  await page.goto("/#/share-the-gospel");
  await page.getByRole("button", { name: "< Back" }).click();

  await page.goto("/#/search-options");
  await expect(page).toHaveTitle(/Search Options | Memorize Bible Verses"/);
});

test("auto-fill form based on query parameter values", async ({ page }) => {
  await page.goto("/#/share-the-gospel?translation=BSB&verse=John+14%3A6");
  await expect(
    page.getByRole("combobox", { name: "Bible Translation Selection" }),
  ).toHaveValue(bibleIdBSB);

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /I am the way and the truth and the life/,
  );
  await expect(page.locator(".citation")).toHaveText(/Berean Standard Bible/);
});

test("select a verse", async ({ page }) => {
  await page.goto("/#/share-the-gospel");

  await page
    .getByRole("combobox", { name: "Bible Translation Selection" })
    .selectOption({ label: "BSB - Berean Standard Bible" });

  await page
    .getByRole("button", { name: "Believe in Jesus and be saved" })
    .click();

  await page.getByRole("button", { name: "John 14:6" }).click();

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /I am the way and the truth and the life/,
  );
  await expect(page.locator(".citation")).toHaveText(/Berean Standard Bible/);
});

import { test, expect } from "@playwright/test";

import bibleData from "./mocks/bibles.json" with { type: "json" };
import verseReferenceDataNKJV from "./mocks/verses/NKJV/verse-reference-john-3-16.json" with { type: "json" };
import verseReferenceDataBSB from "./mocks/verses/BSB/verse-reference-john-3-16.json" with { type: "json" };

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
      await route.fulfill({ json: verseReferenceDataNKJV });
    },
  );

  await page.route(
    `**/api/v1/bibles/${bibleIdBSB}/passages/verse-reference`,
    async (route) => {
      await route.fulfill({ json: verseReferenceDataBSB });
    },
  );
});

test("page load", async ({ page }) => {
  await page.goto("/#/advanced-search");

  await expect(page).toHaveTitle(/Advanced Search | Memorize Bible Verses"/);
  await expect(
    page.getByRole("heading", { name: "Advanced Search" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Bible Translation Selection" }),
  ).toHaveValue(bibleIdNKJV);

  await expect(page.getByLabel("Enter a bible verse reference")).toBeFocused();
});

test("back button", async ({ page }) => {
  await page.goto("/#/advanced-search");
  await page.getByRole("button", { name: "< Back" }).click();

  await page.goto("/#/search-options");
  await expect(page).toHaveTitle(/Search Options | Memorize Bible Verses"/);
});

test("search for verse", async ({ page }) => {
  await page.goto("/#/advanced-search");
  await page.getByLabel("Enter a bible verse reference").fill("John 3:16");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /For God so loved the world/,
  );
  await expect(page.locator(".citation")).toHaveText(/New King James Version/);
});

test("change bible translation", async ({ page }) => {
  await page.goto("/#/advanced-search");
  await page.getByLabel("Enter a bible verse reference").fill("John 3:16");
  await page.getByRole("button", { name: "Search" }).click();
  await page
    .getByRole("combobox", { name: "Bible Translation Selection" })
    .selectOption({ label: "BSB - Berean Standard Bible" });

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /For God so loved the world/,
  );
  await expect(page.locator(".citation")).toHaveText(/Berean Standard Bible/);
});

test("auto-fill form based on query parameter values", async ({ page }) => {
  await page.goto("/#/advanced-search?translation=BSB&verse=John+3%3A16");
  await expect(page.getByLabel("Enter a bible verse reference")).toHaveValue(
    "John 3:16",
  );
  await expect(
    page.getByRole("combobox", { name: "Bible Translation Selection" }),
  ).toHaveValue(bibleIdBSB);

  await expect(page.locator("bible-verse-blockquote")).toHaveText(
    /For God so loved the world/,
  );
  await expect(page.locator(".citation")).toHaveText(/Berean Standard Bible/);
});

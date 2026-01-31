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

  await expect(page).toHaveTitle(
    /John 3:16 | Advanced Search | Memorize Bible Verses"/,
  );
});

test("display validation error for invalid verse reference", async ({
  page,
}) => {
  await page.goto("/#/advanced-search");
  await page
    .getByLabel("Enter a bible verse reference")
    .fill("UnknownBookName 1:1");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.locator("search-form")).toHaveText(
    /Please enter a valid verse reference/,
  );
  await expect(page.locator("search-form")).toHaveText(/Invalid book name/);
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

test("displays an alert when verse reference api returns invalid json content", async ({
  page,
}) => {
  await page.route(
    "**/api/v1/bibles/*/passages/verse-reference",
    async (route) => {
      const copyOfVerseReferenceDataBSB = globalThis.structuredClone(
        verseReferenceDataBSB,
      );
      copyOfVerseReferenceDataBSB.data.content[0].type = "unexpected-type-name";
      await route.fulfill({ json: copyOfVerseReferenceDataBSB });
    },
  );

  await page.goto("/#/advanced-search");
  await page.getByLabel("Enter a bible verse reference").fill("John 3:16");
  await page.getByRole("button", { name: "Search" }).click();

  const alertElement = page.locator('alert-message[type="danger"]');
  await expect(alertElement).toHaveText(/Failed to load bible verse/);
  await expect(alertElement).toHaveText(/invalid_value/);
});

test("displays an alert when verse reference api returns a 500 error", async ({
  page,
}) => {
  await page.route(
    "**/api/v1/bibles/*/passages/verse-reference",
    async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        json: {
          error: "Internal Server Error",
          errorDescription: "some unknown error occurred",
        },
      });
    },
  );

  await page.goto("/#/advanced-search");
  await page.getByLabel("Enter a bible verse reference").fill("John 3:16");
  await page.getByRole("button", { name: "Search" }).click();

  const alertElement = page.locator('alert-message[type="danger"]');
  await expect(alertElement).toHaveText(/Failed to load bible verse/);
  await expect(alertElement).toHaveText(/response status: 500/);
});

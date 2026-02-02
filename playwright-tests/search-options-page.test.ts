import { test, expect } from "@playwright/test";

import verseReferenceData from "./mocks/verses/NKJV/verse-reference-john-3-16.json" with { type: "json" };
import verseOfTheDayData from "./mocks/verses/NKJV/verse-of-the-day-2-peter-3-7.json" with { type: "json" };

test.beforeEach(async ({ page }) => {
  await page.route(
    "**/api/v1/bibles/*/passages/verse-reference",
    async (route) => {
      await route.fulfill({ json: verseReferenceData });
    },
  );

  await page.route("**/api/v1/bibles/*/verse-of-the-day", async (route) => {
    await route.fulfill({ json: verseOfTheDayData });
  });
});

test("page load", async ({ page }) => {
  await page.goto("/#/search-options");
  await expect(page).toHaveTitle(/Search Options | Memorize Bible Verses"/);
  await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
});

test("verse of the day button", async ({ page }) => {
  await page.goto("/#/search-options");
  await page.getByRole("button", { name: "Verse of the Day" }).click();

  await expect(page.url()).toContain("/#/verse-of-the-day");
  await expect(page).toHaveTitle(/Verse of the Day | Memorize Bible Verses"/);
});

test("share the gospel button", async ({ page }) => {
  await page.goto("/#/search-options");
  await page.getByRole("button", { name: "Share the Gospel" }).click();

  await expect(page.url()).toContain("/#/share-the-gospel");
  await expect(page).toHaveTitle(
    /Verses for Sharing the Gospel | Memorize Bible Verses"/,
  );
});

test("psalm 23 button", async ({ page }) => {
  await page.goto("/#/search-options");
  await page.getByRole("button", { name: "Psalm 23" }).click();

  await expect(page.url()).toContain("/#/psalm-23");
  await expect(page).toHaveTitle(/Psalm 23 | Memorize Bible Verses"/);
});

test("awana button", async ({ page }) => {
  await page.goto("/#/search-options");
  await page.getByRole("button", { name: "Awana Club for Kids" }).click();

  await expect(page.url()).toContain("/#/verses-for-awana");
  await expect(page).toHaveTitle(
    /Verses for Awana Club for Kids | Memorize Bible Verses"/,
  );
});

test("power user button", async ({ page }) => {
  await page.goto("/#/search-options");
  await page
    .getByRole("button", { name: "Power User: Choose Your Verses" })
    .click();

  await expect(page.url()).toContain("/#/advanced-search");
  await expect(page).toHaveTitle(/Advanced Search | Memorize Bible Verses"/);
});

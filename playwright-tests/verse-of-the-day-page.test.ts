import { test, expect } from "@playwright/test";

import bibleData from "./mocks/bibles.json" with { type: "json" };
import verseOfTheDayData from "./mocks/verses/NKJV/verse-of-the-day-2-peter-3-7.json" with { type: "json" };

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/bibles", async (route) => {
    await route.fulfill({ json: bibleData });
  });

  await page.route("**/api/v1/bibles/*/verse-of-the-day", async (route) => {
    await route.fulfill({ json: verseOfTheDayData });
  });
});

test("page load", async ({ page }) => {
  await page.goto("/#/search-verse-of-the-day");

  await expect(page).toHaveTitle(/Verse of the Day | Memorize Bible Verses"/);
  await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "2 Peter 3:7" }),
  ).toBeVisible();
  await expect(page.url()).toContain(
    "/#/search-verse-of-the-day?translation=NKJV&verse=2+Peter+3%3A7",
  );
});

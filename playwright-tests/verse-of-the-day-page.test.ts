import { test, expect, type Request } from "@playwright/test";

import verseOfTheDayData from "./mocks/verses/NKJV/verse-of-the-day-2-peter-3-7.json" with { type: "json" };

let interceptedVerseOfTheDayRequest: Request;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/bibles/*/verse-of-the-day", async (route) => {
    interceptedVerseOfTheDayRequest = route.request();
    await route.fulfill({ json: verseOfTheDayData });
  });
});

test("page load", async ({ page }) => {
  await page.goto("/#/verse-of-the-day");

  await expect(page).toHaveTitle(/Verse of the Day | Memorize Bible Verses"/);
  await expect(
    page.getByRole("heading", { name: "Verse of the Day" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "2 Peter 3:7" }),
  ).toBeVisible();
  await expect(page.url()).toContain(
    "/#/verse-of-the-day?translation=NKJV&verse=2+Peter+3%3A7",
  );
});

test("default date for verse of the day", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2025-11-26T20:30:00"));
  await page.goto("/#/verse-of-the-day");

  await expect(
    page.getByRole("textbox", { name: "Date for Verse of the Day" }),
  ).toHaveValue("2025-11-26");

  await expect(page.locator("#page-heading-date")).toHaveText(
    /Wednesday, November 26, 2025/,
  );

  expect(interceptedVerseOfTheDayRequest.postDataJSON().date).toMatch(
    /2025-11-26/,
  );
});

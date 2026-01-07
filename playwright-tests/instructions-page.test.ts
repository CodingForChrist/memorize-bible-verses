import { test, expect } from "@playwright/test";

test("page load", async ({ page }) => {
  await page.goto("/#/instructions");
  await expect(page).toHaveTitle(/Instructions | Memorize Bible Verses"/);
});

test("redirect to instructions page for any unknown url", async ({ page }) => {
  const pageNames = [
    "", // no hash
    "/#/fake-page", // unknown page name
    "/#/instrctions", // misspelled page name
  ];

  for (const pageName of pageNames) {
    await page.goto(pageName);
    await expect(page.url()).toContain("/#/instructions");
    await expect(page).toHaveTitle(/Instructions | Memorize Bible Verses/);
  }
});

test("get started button", async ({ page }) => {
  await page.goto("");
  await page.getByRole("button", { name: "Get Started" }).click();

  await expect(page.url()).toContain("/#/search-options");
  await expect(page).toHaveTitle(/Search Options | Memorize Bible Verses"/);
});

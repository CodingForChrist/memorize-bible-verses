import { test, expect } from "@playwright/test";

test("page load", async ({ page }) => {
  await page.goto("");
  await expect(page).toHaveTitle(/Instructions | Memorize Bible Verses/);

  await page.goto("/#/instructions");
  await expect(page).toHaveTitle(/Instructions | Memorize Bible Verses"/);
});

test("get started button", async ({ page }) => {
  await page.goto("");
  await page.getByRole("button", { name: "Get Started" }).click();

  await expect(page.url()).toContain("/#/search-options");
  await expect(page).toHaveTitle(/Search Options | Memorize Bible Verses"/);
});

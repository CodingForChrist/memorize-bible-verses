import { test, expect } from "@playwright/test";

test("page load", async ({ page }) => {
  await page.goto("/#/instructions");
  await expect(page).toHaveTitle(/Instructions | Memorize Bible Verses"/);
});

test("redirect to instructions page for unknown url hash", async ({ page }) => {
  const urlHashValues = [
    "", // no hash
    "/#/fake-page", // unknown page name
    "/#/instrctions", // misspelled page name
  ];

  for (const hashValue of urlHashValues) {
    await page.goto(hashValue);
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

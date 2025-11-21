import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { SearchAdvancedPage } from "./searchAdvancedPage";

describe("<search-advanced-page>", () => {
  let searchAdvancedPageElement: SearchAdvancedPage;

  beforeEach(() => {
    searchAdvancedPageElement = document.createElement(
      "search-advanced-page",
    ) as SearchAdvancedPage;
  });

  afterEach(() => {
    searchAdvancedPageElement.remove();
  });

  test("should render search form when bible-id attribute is provided", async () => {
    searchAdvancedPageElement.setAttribute("bible-id", "bba9f40183526463-01");
    document.body.appendChild(searchAdvancedPageElement);
    await searchAdvancedPageElement.updateComplete;

    expect(
      searchAdvancedPageElement.shadowRoot!.querySelector("form"),
    ).toBeTruthy();
  });

  test("should not render search form when bible-id attribute is missing", async () => {
    document.body.appendChild(searchAdvancedPageElement);
    await searchAdvancedPageElement.updateComplete;

    expect(
      searchAdvancedPageElement.shadowRoot!.querySelector("form"),
    ).toBeNull();
  });
});

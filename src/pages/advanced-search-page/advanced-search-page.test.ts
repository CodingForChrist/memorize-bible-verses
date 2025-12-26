import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { AdvancedSearchPage } from "./advanced-search-page";

describe("<advanced-search-page>", () => {
  let advancedSearchPageElement: AdvancedSearchPage;

  beforeEach(() => {
    advancedSearchPageElement = document.createElement(
      "advanced-search-page",
    ) as AdvancedSearchPage;
  });

  afterEach(() => {
    advancedSearchPageElement.remove();
  });

  test("should render search form when bible-id attribute is provided", async () => {
    advancedSearchPageElement.setAttribute("bible-id", "bba9f40183526463-01");
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("form"),
    ).toBeTruthy();
  });

  test("should not render search form when bible-id attribute is missing", async () => {
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("form"),
    ).toBeNull();
  });
});

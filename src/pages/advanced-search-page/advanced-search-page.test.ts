import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { AdvancedSearchPage } from "./advanced-search-page";
import { fetchBibleTranslationsWithCache } from "../../services/api";

vi.mock("../../services/api", async (importOriginal) => {
  return {
    ...(await importOriginal()),
    fetchBibleTranslationsWithCache: vi.fn().mockResolvedValue({ data: [] }),
  };
});

describe("<advanced-search-page>", () => {
  let advancedSearchPageElement: AdvancedSearchPage;

  beforeEach(() => {
    vi.resetAllMocks();

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

    expect(fetchBibleTranslationsWithCache).toBeCalled();

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("search-form"),
    ).toBeTruthy();
  });

  test("should not render search form when bible-id attribute is missing", async () => {
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(fetchBibleTranslationsWithCache).toBeCalled();

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("search-form"),
    ).toBeNull();
  });
});

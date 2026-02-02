import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { AdvancedSearchPage } from "./advanced-search-page";
import { fetchBibleVerseWithCache } from "../../services/api";

vi.mock("../../services/api", async () => {
  const { mockApiModule } = await import("../../services/api-mock");
  return mockApiModule;
});

describe("<advanced-search-page>", () => {
  let advancedSearchPageElement: AdvancedSearchPage;

  beforeEach(() => {
    advancedSearchPageElement = document.createElement(
      "advanced-search-page",
    ) as AdvancedSearchPage;

    vi.unstubAllGlobals();
  });

  afterEach(() => {
    advancedSearchPageElement.remove();
  });

  test("should render search form when bible-id attribute is provided", async () => {
    advancedSearchPageElement.setAttribute("bible-id", "bba9f40183526463-01");
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("search-form"),
    ).toBeTruthy();
  });

  test("should not render search form when bible-id attribute is missing", async () => {
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("search-form"),
    ).toBeNull();
  });

  test("should render verse from url", async () => {
    vi.stubGlobal("location", {
      ...globalThis.location,
      origin: "http://localhost:3000",
      pathname: "/memorize-bible-verses/",
      href: "http://localhost:3000/memorize-bible-verses/#/advanced-search?translation=BSB&verse=John+3%3A16",
      hash: "#/advanced-search?translation=BSB&verse=John+3%3A16",
    });

    advancedSearchPageElement.setAttribute("bible-id", "bba9f40183526463-01");
    document.body.append(advancedSearchPageElement);
    await advancedSearchPageElement.updateComplete;

    expect(
      advancedSearchPageElement.shadowRoot!.querySelector("search-form"),
    ).toBeTruthy();

    // wait for verse to get set from url hash
    await vi.waitFor(() => {
      expect(advancedSearchPageElement.verseReference).toBeTruthy();
    });

    await advancedSearchPageElement.updateComplete;

    expect(fetchBibleVerseWithCache).toBeCalled();

    const bibleVerseFetchResultElement =
      advancedSearchPageElement.shadowRoot!.querySelector(
        "bible-verse-fetch-result",
      ) as HTMLElement;

    expect(bibleVerseFetchResultElement.getAttribute("verse-reference")).toBe(
      "John 3:16",
    );
  });
});

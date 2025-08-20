import { beforeEach, describe, expect, test } from "vitest";
import { BibleVerseAdvancedSearch } from "./bibleVerseAdvancedSearch";

describe("<bible-verse-advanced-search>", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should render form when selected-bible-id attribute is provided", () => {
    document.body.innerHTML =
      '<bible-verse-advanced-search bible-id="bba9f40183526463-01"></bible-verse-advanced-search>';
    const bibleVerseSelector = document.querySelector(
      "bible-verse-advanced-search",
    ) as BibleVerseAdvancedSearch;

    expect(
      bibleVerseSelector.shadowRoot!.querySelector("bible-verse-search-form"),
    ).toBeTruthy();
  });

  test("should not render form when selected-bible-id attribute is missing", () => {
    document.body.innerHTML =
      "<bible-verse-advanced-search></bible-verse-advanced-search>";
    const bibleVerseSelector = document.querySelector(
      "bible-verse-advanced-search",
    ) as BibleVerseAdvancedSearch;

    expect(
      bibleVerseSelector.shadowRoot!.querySelector("bible-verse-search-form"),
    ).toBeNull();
  });
});

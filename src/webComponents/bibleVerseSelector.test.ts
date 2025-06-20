import { beforeEach, describe, expect, test } from "vitest";
import { BibleVerseSelector } from "./bibleVerseSelector";

describe("<bible-verse-selector>", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should render form when selected-bible-id attribute is provided", () => {
    document.body.innerHTML =
      '<bible-verse-selector selected-bible-id="bba9f40183526463-01"></bible-verse-selector>';
    const bibleVerseSelector = document.querySelector(
      "bible-verse-selector",
    ) as BibleVerseSelector;

    expect(bibleVerseSelector.querySelector("#form-input-verse")).toBeTruthy();
  });

  test("should not render form when selected-bible-id attribute is missing", () => {
    document.body.innerHTML = "<bible-verse-selector></bible-verse-selector>";
    const bibleVerseSelector = document.querySelector(
      "bible-verse-selector",
    ) as BibleVerseSelector;

    expect(bibleVerseSelector.innerHTML).toBe("");
  });
});

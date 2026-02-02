import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { BibleTranslationDropDownList } from "./bible-translation-drop-down-list";
import { findBibleTranslationById } from "../data/bible-translation-model";
import { CUSTOM_EVENT } from "../constants";

describe("<bible-translation-drop-down-list>", () => {
  let bibleTranslationDropDownListElement: BibleTranslationDropDownList;

  beforeEach(() => {
    bibleTranslationDropDownListElement = document.createElement(
      "bible-translation-drop-down-list",
    ) as BibleTranslationDropDownList;
  });

  afterEach(() => {
    bibleTranslationDropDownListElement.remove();
  });

  test("should default to NKJV", async () => {
    const eventMock = vi.fn();
    bibleTranslationDropDownListElement.addEventListener(
      CUSTOM_EVENT.UPDATE_BIBLE_TRANSLATION,
      eventMock,
    );

    document.body.append(bibleTranslationDropDownListElement);
    await bibleTranslationDropDownListElement.updateComplete;

    const selectedBibleTranslation = findBibleTranslationById(
      bibleTranslationDropDownListElement.bibleId,
    );

    expect(selectedBibleTranslation.abbreviation).toBe("NKJV");

    expect(eventMock).toHaveBeenCalled();
    expect(eventMock.mock.calls[0][0].detail.bibleTranslation).toMatchObject({
      abbreviation: "NKJV",
    });
  });
});

import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { BibleTranslationDropDownList } from "./bible-translation-drop-down-list";
import { fetchBibleTranslationsWithCache } from "../services/api";
import { CUSTOM_EVENT } from "../constants";

vi.mock("../services/api", async () => {
  const { mockApiModule } = await import("../services/api-mock");
  return mockApiModule;
});

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

    expect(fetchBibleTranslationsWithCache).toBeCalled();

    // wait for lit task to complete
    await vi.waitFor(() => {
      expect(
        bibleTranslationDropDownListElement.shadowRoot!.querySelector("select"),
      ).toBeTruthy();
    });

    const selectElement =
      bibleTranslationDropDownListElement.shadowRoot!.querySelector(
        "select",
      ) as HTMLSelectElement;
    expect(selectElement.selectedOptions[0].textContent.trim()).toBe(
      "NKJV - New King James Version",
    );

    expect(eventMock).toHaveBeenCalled();
    expect(eventMock.mock.calls[0][0].detail.bibleTranslation).toMatchObject({
      abbreviation: "NKJV",
    });
  });

  test("should display an error message when api call fails", async () => {
    vi.mocked(fetchBibleTranslationsWithCache).mockRejectedValueOnce(
      new Error("api error"),
    );

    document.body.append(bibleTranslationDropDownListElement);
    await bibleTranslationDropDownListElement.updateComplete;

    expect(fetchBibleTranslationsWithCache).toBeCalled();

    // wait for lit task to error
    await vi.waitFor(() => {
      expect(
        bibleTranslationDropDownListElement.shadowRoot!.querySelector(
          'alert-message[type="danger"]',
        ),
      ).toBeTruthy();
    });
  });
});

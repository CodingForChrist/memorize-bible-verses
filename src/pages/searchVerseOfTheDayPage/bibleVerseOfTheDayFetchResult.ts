import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { Task } from "@lit/task";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";
import { fetchBibleVerseOfTheDayWithCache } from "../../services/api";
import { removeExtraContentFromBibleVerse } from "../../services/formatApiResponse";
import { parseDate, formatDate } from "./dateTimeUtility";
import { CUSTOM_EVENTS } from "../../constants";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../../types";

@customElement("bible-verse-of-the-day-fetch-result")
export class BibleVerseOfTheDayFetchResult extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ reflect: true })
  date?: string;

  static styles = [
    unsafeCSS(scriptureStyles),
    css`
      :host {
        display: block;
      }
      bible-verse-blockquote,
      alert-message {
        margin-top: 3rem;
      }
      alert-message {
        margin-bottom: 2rem;
      }
      bible-verse-blockquote .scripture-styles {
        color: var(--color-gray);
      }
      h2 {
        font-size: 1.5rem;
        font-weight: 400;
        text-align: center;
      }
    `,
  ];

  #bibleVerseOfTheDayTask = new Task(this, {
    task: async ([bibleId, date]) => {
      if (!bibleId || !date) {
        return null;
      }

      try {
        const dateISOStringWithTimezoneOffset = formatDate(
          parseDate(date, "YYYY-MM-DD"),
          "ISO8601",
        );
        const verseBibleData = await fetchBibleVerseOfTheDayWithCache({
          bibleId,
          date: dateISOStringWithTimezoneOffset,
        });
        const enhancedBibleVerseData =
          this.#validateAndEnhanceVerseData(verseBibleData);
        this.#sendEventForSelectedBibleVerse(enhancedBibleVerseData);
        return enhancedBibleVerseData;
      } catch (error) {
        throw new Error(`Error fetching verse of the day: ${error}`);
      }
    },
    args: () => [this.bibleId, this.date],
  });

  #validateAndEnhanceVerseData(verseData: any) {
    if (typeof verseData.data !== "object") {
      throw new Error("expected data to be an object");
    }

    const { id, bibleId, reference, content, verseCount } =
      verseData.data as BibleVerse;

    const options = {
      shouldRemoveSectionHeadings: true,
      shouldRemoveFootnotes: true,
      shouldRemoveVerseNumbers: verseCount < 2,
      shouldTrimParagraphBreaks: true,
    };

    return {
      id,
      bibleId,
      reference,
      content: removeExtraContentFromBibleVerse(content, options),
      verseCount,
    };
  }

  render() {
    if (!this.bibleId || !this.date) {
      return null;
    }

    return this.#bibleVerseOfTheDayTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (verseData) =>
        verseData === null
          ? null
          : html`
              <h2>${verseData.reference}</h2>
              <bible-verse-blockquote
                bible-id=${this.bibleId}
                display-citation=${true}
              >
                <span class="scripture-styles">
                  ${unsafeHTML(verseData.content)}
                </span>
              </bible-verse-blockquote>
            `,
      error: (error) => html`
        <alert-message type="danger">
          Failed to load verse of the day. Please try again later. ${error}
        </alert-message>
      `,
    });
  }

  #sendEventForSelectedBibleVerse(bibleVerse: BibleVerse) {
    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventUpdateBibleVerse>(
        CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
        {
          detail: { bibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateSelectedBible);
  }
}

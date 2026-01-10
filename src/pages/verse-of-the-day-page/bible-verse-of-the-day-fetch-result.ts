import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";
import { fetchBibleVerseOfTheDayWithCache } from "../../services/api";
import { standardizeVerseReference } from "../../services/format-api-response";
import { parseDate, formatDate } from "./date-time-utility";
import { CUSTOM_EVENT } from "../../constants";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../../types";

import "../../components/alert-message";
import "../../components/loading-spinner";
import "../../components/bible-verse-json-to-html";
import "../../components/bible-verse-blockquote";

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
        color: var(--color-dark-gray);
        line-height: 1.5;
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
        return;
      }
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
    },
    args: () => [this.bibleId, this.date],
  });

  #validateAndEnhanceVerseData(verseData: Record<string, unknown>) {
    if (typeof verseData.data !== "object") {
      throw new TypeError("expected data to be an object");
    }

    const { id, bibleId, reference, content, verseCount } =
      verseData.data as BibleVerse;

    return {
      id,
      bibleId,
      reference: standardizeVerseReference(reference),
      content,
      verseCount,
    };
  }

  #renderVerse(verseData?: BibleVerse) {
    if (!this.bibleId || !verseData) {
      return;
    }

    const { content, reference, verseCount } = verseData;

    return html`
      <h2>${reference}</h2>
      <bible-verse-blockquote
        bible-id=${this.bibleId}
        ?display-citation=${true}
      >
        <bible-verse-json-to-html
          .content=${content}
          ?include-verse-numbers=${verseCount > 1}
        ></bible-verse-json-to-html>
      </bible-verse-blockquote>
    `;
  }

  render() {
    if (!this.bibleId || !this.date) {
      return;
    }

    return this.#bibleVerseOfTheDayTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (verseData) => this.#renderVerse(verseData),
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Internal Server Error";
        return html`
          <alert-message type="danger">
            Failed to load verse of the day. <br />${errorMessage}
          </alert-message>
        `;
      },
    });
  }

  #sendEventForSelectedBibleVerse(bibleVerse: BibleVerse) {
    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventUpdateBibleVerse>(
        CUSTOM_EVENT.UPDATE_BIBLE_VERSE,
        {
          detail: { bibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateSelectedBible);
  }
}

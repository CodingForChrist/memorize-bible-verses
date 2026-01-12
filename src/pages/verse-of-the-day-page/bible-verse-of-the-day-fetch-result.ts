import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Task } from "@lit/task";

import { fetchBibleVerseOfTheDayWithCache } from "../../services/api";
import { parseDate, formatDate } from "./date-time-utility";
import { CUSTOM_EVENT } from "../../constants";

import "../../components/alert-message";
import "../../components/loading-spinner";
import "../../components/bible-verse-blockquote";

import type { BibleVerse } from "../../schemas/bible-verse-schema";

@customElement("bible-verse-of-the-day-fetch-result")
export class BibleVerseOfTheDayFetchResult extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ reflect: true })
  date?: string;

  static styles = [
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
      const bibleVerse = await fetchBibleVerseOfTheDayWithCache({
        bibleId,
        date: dateISOStringWithTimezoneOffset,
      });
      this.#sendEventForSelectedBibleVerse(bibleVerse);
      return bibleVerse;
    },
    args: () => [this.bibleId, this.date],
  });

  #renderVerse(bibleVerse?: BibleVerse) {
    if (!this.bibleId || !bibleVerse) {
      return;
    }

    const {
      content,
      reference,
      verseCount,
      bibleId,
      citationLink,
      citationText,
    } = bibleVerse;

    return html`
      <h2>${reference}</h2>
      <bible-verse-blockquote
        .content=${content}
        ?display-verse-numbers=${verseCount > 1}
        bible-id=${bibleId}
        citation-text=${citationText}
        citation-link=${ifDefined(citationLink)}
      >
      </bible-verse-blockquote>
    `;
  }

  render() {
    if (!this.bibleId || !this.date) {
      return;
    }

    return this.#bibleVerseOfTheDayTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (bibleVerse) => this.#renderVerse(bibleVerse),
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
    const eventUpdateSelectedBible = new CustomEvent<{
      bibleVerse: BibleVerse;
    }>(CUSTOM_EVENT.UPDATE_BIBLE_VERSE, {
      detail: { bibleVerse },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateSelectedBible);
  }
}

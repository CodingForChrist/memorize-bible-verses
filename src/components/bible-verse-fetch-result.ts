import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { Task } from "@lit/task";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";
import { fetchBibleVerseWithCache } from "../services/api";
import { CUSTOM_EVENT } from "../constants";
import {
  removeExtraContentFromBibleVerse,
  standardizeVerseReference,
} from "../services/format-api-response";

import "./alert-message";
import "./loading-spinner";
import "./bible-verse-blockquote";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../types";

@customElement("bible-verse-fetch-result")
export class BibleVerseFetchResult extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({
    type: Boolean,
    attribute: "should-display-section-headings",
    reflect: true,
  })
  shouldDisplaySectionHeadings: boolean = false;

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
    `,
  ];

  #bibleVerseTask = new Task(this, {
    task: async ([bibleId, verseReference]) => {
      if (!bibleId || !verseReference) {
        return;
      }
      const verseBibleData = await fetchBibleVerseWithCache({
        bibleId,
        verseReference,
      });
      const enhancedBibleVerseData =
        this.#validateAndEnhanceVerseData(verseBibleData);
      this.#sendEventForSelectedBibleVerse(enhancedBibleVerseData);
      return enhancedBibleVerseData;
    },
    args: () => [this.bibleId, this.verseReference],
  });

  #validateAndEnhanceVerseData(verseData: Record<string, unknown>) {
    if (typeof verseData.data !== "object") {
      throw new TypeError("expected data to be an object");
    }

    const { id, bibleId, reference, content, verseCount } =
      verseData.data as BibleVerse;

    const options = {
      shouldRemoveSectionHeadings: !this.shouldDisplaySectionHeadings,
      shouldRemoveFootnotes: true,
      shouldRemoveVerseNumbers: verseCount < 2,
      shouldTrimParagraphBreaks: true,
    };

    return {
      id,
      bibleId,
      reference: standardizeVerseReference(reference),
      content: removeExtraContentFromBibleVerse(content, options),
      verseCount,
    };
  }

  #renderVerse(verseData?: BibleVerse) {
    if (!this.bibleId || !verseData) {
      return;
    }
    return html`
      <bible-verse-blockquote
        bible-id=${this.bibleId}
        ?display-citation=${true}
      >
        <span class="scripture-styles"> ${unsafeHTML(verseData.content)} </span>
      </bible-verse-blockquote>
    `;
  }

  render() {
    if (!this.bibleId || !this.verseReference) {
      return;
    }

    return this.#bibleVerseTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (verseData) => this.#renderVerse(verseData),
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Internal Server Error";
        return html`
          <alert-message type="danger">
            Failed to load bible verse. <br />${errorMessage}
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

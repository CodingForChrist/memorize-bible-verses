import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Task } from "@lit/task";

import { fetchBibleVerseWithCache } from "../services/api";
import { CUSTOM_EVENT } from "../constants";

import "./alert-message";
import "./loading-spinner";
import "./bible-verse-blockquote";

import type { BibleVerse } from "../schemas/bible-verse-schema";

@customElement("bible-verse-fetch-result")
export class BibleVerseFetchResult extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({
    type: Boolean,
    attribute: "include-titles",
    reflect: true,
  })
  includeTitles: boolean = false;

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
    `,
  ];

  #bibleVerseTask = new Task(this, {
    task: async ([bibleId, verseReference]) => {
      if (!bibleId || !verseReference) {
        return;
      }
      const bibleVerse = await fetchBibleVerseWithCache({
        bibleId,
        verseReference,
        includeTitles: this.includeTitles,
      });
      this.#sendEventForSelectedBibleVerse(bibleVerse);
      return bibleVerse;
    },
    args: () => [this.bibleId, this.verseReference],
  });

  #renderVerse(bibleVerse?: BibleVerse) {
    if (!this.bibleId || !bibleVerse) {
      return;
    }
    const { content, verseCount, bibleId, citationText, citationLink } =
      bibleVerse;
    return html`
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
    if (!this.bibleId || !this.verseReference) {
      return;
    }

    return this.#bibleVerseTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (bibleVerse) => this.#renderVerse(bibleVerse),
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

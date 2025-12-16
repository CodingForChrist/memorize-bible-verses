import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { findBibleTranslationById } from "../data/bible-translation-model";
import { hyperlinkStyles } from "./shared-styles";

@customElement("bible-verse-blockquote")
export class BibleVerseBlockquote extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ type: Boolean, attribute: "display-citation", reflect: true })
  displayCitation: boolean = false;

  static styles = [
    hyperlinkStyles,
    css`
      :host {
        display: block;
        font-size: 1.25rem;
      }
      blockquote {
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0;
      }
      .citation {
        font-size: 60%;
        margin-top: 3rem;
        margin-bottom: 0;
      }
    `,
  ];

  #renderCitation() {
    if (!this.bibleId || !this.displayCitation) {
      return;
    }

    const {
      citation: { text, link },
    } = findBibleTranslationById(this.bibleId);

    if (link) {
      return html`
        <p class="citation">
          ${text}
          <a href="${link}" target="_blank" rel="noopener noreferrer"
            >${link}</a
          >
        </p>
      `;
    }

    return html` <p class="citation">${text}</p> `;
  }

  render() {
    return html`
      <blockquote>
        <slot>BIBLE VERSE MISSING</slot>
      </blockquote>
      ${this.#renderCitation()}
    `;
  }
}

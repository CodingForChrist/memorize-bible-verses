import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { findBibleTranslationById } from "../data/bibleTranslationModel";

@customElement("bible-verse-blockquote")
export class BibleVerseBlockquote extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ type: Boolean, attribute: "display-citation", reflect: true })
  displayCitation: boolean = false;

  static styles = css`
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
    a {
      color: var(--color-primary-bright-pink);
    }
    a:hover {
      color: var(--color-primary-bright-pink-darker-one);
    }
    a:visited {
      color: var(--color-primary-bright-pink-darker-two);
    }
  `;

  #renderCitation() {
    if (!this.bibleId || !this.displayCitation) {
      return null;
    }

    const {
      citation: { text, link },
    } = findBibleTranslationById(this.bibleId);

    return html`<p class="citation">
      ${text}
      <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
    </p>`;
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

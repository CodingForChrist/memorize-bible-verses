import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { when } from "lit/directives/when.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES, CUSTOM_EVENTS } from "../../constants";

import type { CustomEventUpdateRecitedBibleVerse } from "../../types";

@customElement(WEB_COMPONENT_PAGES.TYPE_VERSE_FROM_MEMORY_PAGE)
export class TypeVerseFromMemoryPage extends BasePage(LitElement) {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  #textareaInput = "";
  pageTitle = "Type";

  static styles = css`
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 400;
      text-align: center;
    }
    textarea {
      font: inherit;
      color: inherit;
      width: 100%;
      padding: 1rem;
      background-color: var(--color-primary-mint-cream);
      border: 1px solid var(--color-light-gray);
      border-radius: 1.5rem;
      box-sizing: border-box;
    }
    textarea:focus,
    textarea:active {
      border-color: var(--color-primary-mint-cream);
      outline: 1px solid var(--color-gray);
    }
  `;

  #renderTextArea() {
    const placeholderText = `Type in ${this.verseReference ?? "the verse reference"} from memory...`;

    return html`
      <textarea
        rows="5"
        placeholder=${placeholderText}
        .value=${this.#textareaInput}
        @input=${this.#handleTextareaInput}
      ></textarea>
    `;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Type</span>

        <span slot="page-description">
          <p>Type in the verse below from memory.</p>
          <p>When you are finished go to Step 3.</p>
        </span>

        <span slot="page-content">
          ${when(
            this.verseReference,
            () => html`
              <h2>${this.verseReference}</h2>
              ${this.#renderTextArea()}
            `,
            () => html`
              <alert-message type="danger">
                Go back to Step 1 and select a bible verse.
              </alert-message>
            `,
          )}
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 3 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({
      nextPage: this.previousPage ?? WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE,
    });
  }

  #handleForwardButtonClick() {
    this.#sendEventForRecitedBibleVerse();

    this.navigateToPage({
      nextPage: WEB_COMPONENT_PAGES.SCORE_PAGE,
      previousPage: WEB_COMPONENT_PAGES.TYPE_VERSE_FROM_MEMORY_PAGE,
    });
  }

  #handleTextareaInput(event: FocusEvent) {
    this.#textareaInput = (event.target as HTMLTextAreaElement).value;
  }

  #sendEventForRecitedBibleVerse() {
    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse: this.#textareaInput },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateRecitedBibleVerse);
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Type ${this.verseReference ?? ""}`;
      this.#textareaInput = "";
    }
  }
}

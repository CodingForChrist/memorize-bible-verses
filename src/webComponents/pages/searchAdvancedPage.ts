import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE)
export class SearchAdvancedPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @state()
  verseReference = "";

  #textInput = "";
  pageTitle = "Advanced Search";

  static styles = css`
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
    bible-translation-drop-down-list {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
    }
    label small {
      font-size: 0.75rem;
      line-height: calc(1.25 / 0.875);
    }
    form {
      display: flex;
      gap: 0.25rem;
      margin-top: 0.25rem;
    }
    input {
      font: inherit;
      color: inherit;
      line-height: 1.5rem;
      flex: 1;
      width: 100%;
      padding: 0.5rem 0.75rem;
      background-color: var(--color-primary-mint-cream);
      border: 1px solid var(--color-light-gray);
      border-radius: 1.5rem;
    }
    input:focus,
    input:active {
      border-color: var(--color-primary-mint-cream);
      outline: 1px solid var(--color-gray);
    }
    input:-webkit-autofill,
    input:-webkit-autofill:focus {
      transition:
        background-color 0s 600000s,
        color 0s 600000s !important;
    }
    branded-button[type="submit"] {
      --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      min-width: 5rem;
    }
  `;

  #renderSearchForm() {
    if (!this.bibleId) {
      return null;
    }

    return html`
      <label for="input-bible-verse">
        <span>Enter a bible verse reference</span><br />
        <small>e.g. "John 1:1" or "John 3:16-21"</small>
      </label>
      <form @submit=${this.#handleFormSubmit}>
        <input
          type="text"
          .value=${this.#textInput}
          @input=${this.#handleTextInput}
          required
          autofocus
        />
        <branded-button type="submit">
          <span slot="button-text">Search</span>
        </branded-button>
      </form>
    `;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>
            Power Users can enter specific verses. <br />
            Simply type in the book, chapter number and verse number you wish to
            learn. Then practice the verse.
          </p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-drop-down-list
            bible-id=${this.bibleId}
          ></bible-translation-drop-down-list>

          ${this.#renderSearchForm()}

          <bible-verse-fetch-result
            bible-id=${this.bibleId}
            verse-reference=${this.verseReference}
            ?visible=${this.visible}
          ></bible-verse-fetch-result>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE,
    });
  }

  #handleTextInput(event: Event) {
    this.#textInput = (event.target as HTMLInputElement).value;
  }

  #handleFormSubmit(event: Event) {
    event.preventDefault();
    this.verseReference = this.#textInput;
  }
}

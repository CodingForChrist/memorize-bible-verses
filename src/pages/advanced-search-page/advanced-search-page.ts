import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { getStateFromURL } from "../../services/router";
import { PAGE_NAME } from "../../constants";
import {
  formControlStyles,
  buttonStyles,
} from "../../components/shared-styles";

import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";

@customElement("advanced-search-page")
export class AdvancedSearchPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @state()
  verseReference = getStateFromURL()?.verse;

  #textInput = this.verseReference ?? "";
  pageTitle = "Advanced Search";

  static styles = [
    formControlStyles,
    buttonStyles,
    css`
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
      button[type="submit"] {
        --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        min-width: 6rem;
      }
    `,
  ];

  #renderSearchForm() {
    if (!this.bibleId) {
      return;
    }

    return html`
      <label for="input-verse-reference">
        <span>Enter a bible verse reference</span><br />
        <small>e.g. "John 1:1" or "John 3:16-21"</small>
      </label>
      <form @submit=${this.#handleFormSubmit}>
        <input
          type="text"
          id="input-verse-reference"
          .value=${this.#textInput}
          @input=${this.#handleTextInput}
          required
          autofocus
        />
        <button type="submit" class="primary">Search</button>
      </form>
    `;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Advanced Search</span>

        <p slot="page-description">
          Power Users can enter specific verses. Simply type in the book,
          chapter number and verse number you wish to learn.
        </p>
        <p slot="page-description">
          When you have the verse memorized go to Step 2.
        </p>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          ${this.#renderSearchForm()}

          <bible-verse-fetch-result
            bible-id=${ifDefined(this.bibleId)}
            verse-reference=${ifDefined(this.verseReference)}
          ></bible-verse-fetch-result>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.ADVANCED_SEARCH_PAGE,
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

import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";

import "./search-form";
import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";

@customElement("advanced-search-page")
export class AdvancedSearchPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @state()
  verseReference?: string;

  static defaultPageTitle = "Advanced Search";
  pageTitle = AdvancedSearchPage.defaultPageTitle;

  static styles = css`
    bible-translation-drop-down-list {
      margin-bottom: 1.5rem;
    }
  `;

  #renderSearchForm() {
    if (!this.bibleId) {
      return;
    }

    return html`
      <search-form @submit=${this.#handleFormSubmit}></search-form>
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

  #handleFormSubmit(event: CustomEventInit<{ verseReference: string }>) {
    const verseReference = event.detail?.verseReference;

    if (typeof verseReference === "string") {
      this.verseReference = verseReference;
    }
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (!changedProperties.has("verseReference")) {
      return;
    }

    this.pageTitle = this.verseReference
      ? `${this.verseReference} | ${AdvancedSearchPage.defaultPageTitle}`
      : AdvancedSearchPage.defaultPageTitle;
  }
}

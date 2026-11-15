import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { formControlStyles } from "../../components/shared-styles";

import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";
import "./awana-book-drop-down-list";
import "./awana-verse-drop-down-list";

@customElement("verses-for-awana-page")
export class VersesForAwanaPage extends BasePage(LitElement) {
  static defaultPageTitle = "Verses for Awana Club for Kids";

  static styles = [
    formControlStyles,
    css`
      bible-translation-drop-down-list,
      awana-book-drop-down-list {
        margin-bottom: 1.5rem;
      }
    `,
  ];

  pageTitle = VersesForAwanaPage.defaultPageTitle;

  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @state()
  verseReference?: string;

  @state()
  awanaBookId?: string;

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.VERSES_FOR_AWANA_PAGE,
    });
  }

  #handleAwanaBookIdChange(event: CustomEventInit<{ awanaBookId: string }>) {
    const awanaBookId = event.detail?.awanaBookId;

    if (!awanaBookId) {
      return;
    }

    this.awanaBookId = awanaBookId;
    this.verseReference = undefined;
  }

  #handleVerseReferenceChange(
    event: CustomEventInit<{ verseReference: string }>,
  ) {
    const verseReference = event.detail?.verseReference;

    if (!verseReference) {
      return;
    }

    this.verseReference = verseReference;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Awana Club for Kids</span>

        <p slot="page-description">Pick and practice a verse for Awana.</p>
        <p slot="page-description">
          When you have the verse memorized go to Step 2.
        </p>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          <awana-book-drop-down-list
            ?hidden=${this.bibleId === undefined}
            @change=${this.#handleAwanaBookIdChange}
          ></awana-book-drop-down-list>

          <awana-verse-drop-down-list
            awana-book-id=${ifDefined(this.awanaBookId)}
            @change=${this.#handleVerseReferenceChange}
          ></awana-verse-drop-down-list>

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

  willUpdate(changedProperties: PropertyValues<this>) {
    if (!changedProperties.has("verseReference")) {
      return;
    }

    this.pageTitle = this.verseReference
      ? `${this.verseReference} - ${VersesForAwanaPage.defaultPageTitle}`
      : VersesForAwanaPage.defaultPageTitle;
  }
}

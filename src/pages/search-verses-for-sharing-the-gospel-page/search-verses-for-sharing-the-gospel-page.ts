import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";

@customElement("search-verses-for-sharing-the-gospel-page")
export class SearchVersesForSharingTheGospelPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property()
  verseReference?: string;

  pageTitle = "Verses for Sharing the Gospel";

  static styles = css`
    bible-translation-drop-down-list {
      margin-bottom: 1.5rem;
    }
  `;

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Share the Gospel</span>

        <p slot="page-description">
          Pick and practice a verse for sharing the gospel.
        </p>
        <p slot="page-description">
          When you have the verse memorized go to Step 2.
        </p>

        <div class="page-content" slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          <accordion-gospel-verses
            ?hidden=${this.bibleId === undefined}
            @change=${this.#handleVerseReferenceChange}
          ></accordion-gospel-verses>

          <bible-verse-fetch-result
            verse-reference=${ifDefined(this.verseReference)}
            bible-id=${ifDefined(this.bibleId)}
          ></bible-verse-fetch-result>
        </div>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
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

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.SHARE_THE_GOSPEL_PAGE,
    });
  }
}

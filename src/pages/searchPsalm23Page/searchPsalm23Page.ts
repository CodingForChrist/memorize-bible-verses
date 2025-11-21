import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "../basePageMixin";
import { PAGE_NAME } from "../../constants";

@customElement("search-psalm-23-page")
export class SearchPsalm23Page extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  pageTitle = "Psalm 23";

  static styles = css`
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
  `;

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Practice memorizing Psalm 23.</p>
          <p>When you have it memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          <bible-verse-fetch-result
            verse-reference="Psalm 23:1-6"
            should-display-section-headings="true"
            bible-id=${this.bibleId}
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
      previousPage: PAGE_NAME.SEARCH_PSALM_23_PAGE,
    });
  }
}

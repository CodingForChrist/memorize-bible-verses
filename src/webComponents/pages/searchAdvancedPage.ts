import { LitElement, css, html, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE)
export class SearchAdvancedPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  pageTitle = "Advanced Search";

  static styles = css`
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
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
            bible-id=${this.bibleId || nothing}
            ?visible=${this.visible}
          ></bible-translation-drop-down-list>

          <bible-verse-advanced-search
            bible-id=${this.bibleId}
            is-visible=${this.visible}
          ></bible-verse-advanced-search>
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
}

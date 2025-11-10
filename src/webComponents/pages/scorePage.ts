import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { when } from "lit/directives/when.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SCORE_PAGE)
export class ScorePage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @property({ attribute: "recited-bible-verse", reflect: true })
  recitedBibleVerse?: string;

  pageTitle = "Score";

  static styles = css`
    p {
      margin: 1rem 0;
    }
  `;

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Score</span>

        <span slot="page-description">
          <p>Your results are below.</p>
        </span>

        <span slot="page-content">
          ${when(
            this.bibleId &&
              this.verseReference &&
              this.verseContent &&
              this.recitedBibleVerse,
            () =>
              html` <accuracy-report
                bible-id=${this.bibleId}
                verse-reference=${this.verseReference}
                verse-content=${this.verseContent}
                recited-bible-verse=${this.recitedBibleVerse}
              >
              </accuracy-report>`,
            () => html`
              <alert-message type="danger">
                Unable to display report. Complete Step 1 and Step 2 first.
              </alert-message>
            `,
          )}
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">New Verse</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({
      nextPage:
        this.previousPage ?? WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
    });
  }

  #handleForwardButtonClick() {
    // do a full page redirect to clear out state
    window.location.href = `/memorize-bible-verses/?page=${WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE}`;
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Score ${this.verseReference ?? ""}`;
    }
  }
}

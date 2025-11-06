import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

import type { PropertyValues } from "lit";

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

  get #previousPage() {
    return (
      this.getAttribute("previous-page") ??
      WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE
    );
  }

  #renderAlert() {
    if (
      !this.bibleId ||
      !this.verseReference ||
      !this.verseContent ||
      !this.recitedBibleVerse
    ) {
      return html`
        <alert-message type="danger">
          <span slot="alert-message"
            >Unable to display report. Complete Step 1 and Step 2 first.</span
          >
        </alert-message>
      `;
    }

    return null;
  }

  #renderAccuracyReportComponent() {
    if (
      !this.bibleId ||
      !this.verseReference ||
      !this.verseContent ||
      !this.recitedBibleVerse
    ) {
      return null;
    }

    return html`
      <accuracy-report
        bible-id="${this.bibleId}"
        verse-reference="${this.verseReference}"
        verse-content="${this.verseContent}"
        recited-bible-verse="${this.recitedBibleVerse}"
      >
      </accuracy-report>
    `;
  }

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
          ${this.#renderAlert()} ${this.#renderAccuracyReportComponent()}
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">New Verse</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: this.#previousPage });
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

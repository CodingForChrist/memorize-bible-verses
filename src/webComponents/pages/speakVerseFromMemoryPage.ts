import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { when } from "lit/directives/when.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE)
export class SpeakVerseFromMemoryPage extends BasePage(LitElement) {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  pageTitle = "Speak";

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
    #button-fallback {
      --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      margin-top: 3rem;
      width: 100%;
    }
  `;

  get #hasSupportForSpeechRecognition() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  #renderAlert() {
    if (!this.verseReference || !this.verseContent) {
      return html`
        <alert-message type="danger">
          <span slot="alert-message"
            >Go back to Step 1 and select a bible verse.</span
          >
        </alert-message>
      `;
    }

    if (!this.#hasSupportForSpeechRecognition) {
      return html`
        <h2>${this.verseReference}</h2>
        <alert-message type="danger">
          <span slot="alert-message">
            Your browser does not support the Web Speech API. Please try another
            browser like Chrome or Safari.
          </span>
        </alert-message>
        <branded-button
          id="button-fallback"
          brand="secondary"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.TYPE_VERSE_FROM_MEMORY_PAGE,
              previousPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
            })}
        >
          <span slot="button-text">
            Click here to type in the verse instead
          </span>
        </branded-button>
      `;
    }

    return null;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Speak</span>

        <span slot="page-description">
          <p>
            When you are ready, press Record. Speak the entire verse clearly and
            slowly—then press stop. Don't worry if you make a mistake, you can
            record again.
          </p>
          <p>
            Once you have a recording you like go to Step 3 and get your score.
          </p>
        </span>

        <span slot="page-content">
          ${when(
            this.verseReference &&
              this.verseContent &&
              this.#hasSupportForSpeechRecognition,
            () => html`
              <h2>${this.verseReference}</h2>
              <recite-bible-verse
                verse-reference="${this.verseReference}"
                verse-content="${this.verseContent}"
              ></recite-bible-verse>
            `,
            () => this.#renderAlert(),
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
    this.navigateToPage({
      nextPage: WEB_COMPONENT_PAGES.SCORE_PAGE,
      previousPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
    });
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Speak ${this.verseReference ?? ""}`;
    }
  }
}

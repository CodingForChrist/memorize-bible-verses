import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { when } from "lit/directives/when.js";

import { BasePage } from "../basePageMixin";
import { PAGE_NAME } from "../../constants";
import { ButtonStyles } from "../../components/sharedStyles";

@customElement("speak-verse-from-memory-page")
export class SpeakVerseFromMemoryPage extends BasePage(LitElement) {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  pageTitle = "Speak";

  static styles = [
    ButtonStyles,
    css`
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
    `,
  ];

  get #hasSupportForSpeechRecognition() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  #renderAlert() {
    if (!this.verseReference || !this.verseContent) {
      return html`
        <alert-message type="danger">
          Go back to Step 1 and select a bible verse.</span
        </alert-message>
      `;
    }

    if (!this.#hasSupportForSpeechRecognition) {
      return html`
        <h2>${this.verseReference}</h2>
        <alert-message type="danger">
          Your browser does not support the Web Speech API. Please try another
          browser like Chrome or Safari.
        </alert-message>
        <button
          type="button"
          id="button-fallback"
          class="secondary"
          @click=${() =>
            this.navigateToPage({
              nextPage: PAGE_NAME.TYPE_VERSE_FROM_MEMORY_PAGE,
              previousPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
            })}
        >
          Click here to type in the verse instead
        </button>
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
      nextPage: this.previousPage ?? PAGE_NAME.SEARCH_ADVANCED_PAGE,
    });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SCORE_PAGE,
      previousPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
    });
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Speak ${this.verseReference ?? ""}`;
    }
  }
}

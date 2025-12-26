import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { when } from "lit/directives/when.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { buttonStyles } from "../../components/shared-styles";
import {
  SPEECH_RECOGNITION_STATE,
  type SpeechRecognitionState,
} from "./speech-recognition";

@customElement("speak-verse-from-memory-page")
export class SpeakVerseFromMemoryPage extends BasePage(LitElement) {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @property({ attribute: "recited-bible-verse", reflect: true })
  recitedBibleVerse?: string;

  @state()
  speechRecognitionState: SpeechRecognitionState =
    SPEECH_RECOGNITION_STATE.INITIAL;

  pageTitle = "Speak";

  static styles = [
    buttonStyles,
    css`
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

  render() {
    return html`
      <verse-text-page-template
        ?should-hide-page-navigation=${this.speechRecognitionState ===
        SPEECH_RECOGNITION_STATE.LISTENING}
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Speak</span>

        <p slot="page-description">
          When you are ready, press Record. Speak the entire verse clearly and
          slowly—then press stop. Don't worry if you make a mistake, you can
          record again.
        </p>
        <p slot="page-description">
          Once you have a recording you like go to Step 3 and get your score.
        </p>

        <span slot="page-content">
          ${when(
            this.verseReference && this.verseContent,
            () => html`
              <h2>${this.verseReference}</h2>
              <recite-bible-verse
                verse-reference="${ifDefined(this.verseReference)}"
                verse-content="${ifDefined(this.verseContent)}"
                transcript="${ifDefined(this.recitedBibleVerse)}"
                @state-change=${this.#handleSpeechRecognitionStateChange}
              ></recite-bible-verse>
            `,
            () => html`
              <alert-message type="danger">
                Go back to Step 1 and select a bible verse.
              </alert-message>
            `,
          )}
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 3 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({
      nextPage: this.previousPage ?? PAGE_NAME.ADVANCED_SEARCH_PAGE,
    });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SCORE_PAGE,
    });
  }

  #handleSpeechRecognitionStateChange(
    event: CustomEventInit<{ state: SpeechRecognitionState }>,
  ) {
    const speechRecognitionState = event.detail?.state;
    if (speechRecognitionState) {
      this.speechRecognitionState = speechRecognitionState;
    }
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Speak ${this.verseReference ?? ""}`;
    }
  }
}

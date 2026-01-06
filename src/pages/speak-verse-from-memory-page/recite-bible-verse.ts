import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { CUSTOM_EVENT } from "../../constants";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATE,
  SPEECH_RECOGNITION_CUSTOM_EVENT,
  type SpeechRecognitionState,
} from "./speech-recognition";
import { convertBibleVerseToText } from "../../services/format-api-response";
import { autoCorrectSpeechRecognitionInput } from "./auto-correct-spoken-bible-verse";
import { buttonStyles } from "../../components/shared-styles";

import type { CustomEventUpdateRecitedBibleVerse } from "../../types";

import "./transcript-text";
import "../../components/alert-message";
import "../../components/loading-spinner";

@customElement("recite-bible-verse")
export class ReciteBibleVerse extends LitElement {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @property({ reflect: true })
  transcript: string = "";

  @state()
  speechRecognitionState: SpeechRecognitionState =
    SPEECH_RECOGNITION_STATE.INITIAL;

  speechRecognitionService?: SpeechRecognitionService;

  constructor() {
    super();

    try {
      this.speechRecognitionService = new SpeechRecognitionService();
    } catch (error) {
      this.speechRecognitionState = SPEECH_RECOGNITION_STATE.REJECTED;
      console.error("Unable to use the SpeechRecognition API", error);
    }
  }

  static styles = [
    buttonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
      .button-container {
        text-align: center;
      }
      loading-spinner {
        margin: 0;
        margin-left: 0.75rem;
        --spinner-border-width: 2px;
        --spinner-width: 1rem;
        --spinner-height: 1rem;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
        min-width: 7rem;
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
      button .icon {
        margin-right: 0.25rem;
      }
      button .circle-icon {
        background-color: currentColor;
        border-radius: 50%;
        width: 0.85rem;
        height: 0.85rem;
      }
      button .square-icon {
        background-color: currentColor;
        width: 0.75rem;
        height: 0.75rem;
      }
    `,
  ];

  get #hasSupportForSpeechRecognition() {
    return (
      "SpeechRecognition" in globalThis ||
      "webkitSpeechRecognition" in globalThis
    );
  }

  get #verseText() {
    if (!this.verseContent) {
      return "";
    }

    return convertBibleVerseToText(this.verseContent);
  }

  render() {
    if (!this.verseReference || !this.verseContent) {
      return;
    }

    if (!this.#hasSupportForSpeechRecognition) {
      return html`
        <alert-message type="warning">
          Your browser does not support the Web Speech API. Type in the verse
          instead.
        </alert-message>
        <transcript-text
          verse-reference=${this.verseReference}
          transcript=${this.transcript}
          ?no-speech-recognition-support=${true}
        >
        </transcript-text>
      `;
    }

    const {
      INITIAL,
      LISTENING,
      WAITING_FOR_MICROPHONE_ACCESS,
      AUDIOEND,
      RESOLVED,
      REJECTED,
    } = SPEECH_RECOGNITION_STATE;

    return html` ${choose(this.speechRecognitionState, [
      [
        INITIAL,
        () => html`
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleRecordButtonClick}
            >
              <span class="circle-icon"></span>
              <span>Record</span>
            </button>
            <transcript-text
              verse-reference=${ifDefined(this.verseReference)}
              transcript=${this.transcript}
            >
            </transcript-text>
          </div>
        `,
      ],
      [
        WAITING_FOR_MICROPHONE_ACCESS,
        () => html`
          <alert-message type="warning">
            Waiting for microphone access
            <loading-spinner></loading-spinner>
          </alert-message>
          <transcript-text
            verse-reference=${ifDefined(this.verseReference)}
            transcript=${this.transcript}
            ?disabled=${true}
          >
          </transcript-text>
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleStopButtonClick}
            >
              <span class="square-icon"></span>
              <span>Stop</span>
            </button>
          </div>
        `,
      ],
      [
        LISTENING,
        () => html`
          <alert-message type="info">
            Recording in progress
            <loading-spinner></loading-spinner>
          </alert-message>
          <transcript-text
            verse-reference=${ifDefined(this.verseReference)}
            transcript=${this.transcript}
            ?disabled=${true}
          ></transcript-text>
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleStopButtonClick}
            >
              <span class="square-icon"></span>
              <span>Stop</span>
            </button>
          </div>
        `,
      ],
      [
        AUDIOEND,
        () => html`
          <alert-message type="info">
            Finalizing recording
            <loading-spinner></loading-spinner>
          </alert-message>

          <transcript-text
            verse-reference=${ifDefined(this.verseReference)}
            transcript=${this.transcript}
            ?disabled=${true}
          ></transcript-text>
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleRecordButtonClick}
            >
              <span class="circle-icon"></span>
              <span>Try Recording Again</span>
            </button>
          </div>
        `,
      ],
      [
        RESOLVED,
        () => html`
          <alert-message type="success"> Recording complete! </alert-message>
          <transcript-text
            verse-reference=${ifDefined(this.verseReference)}
            transcript=${this.transcript}
          ></transcript-text>
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleRecordButtonClick}
            >
              <span class="circle-icon"></span>
              <span>Try Recording Again</span>
            </button>
          </div>
        `,
      ],
      [
        REJECTED,
        () => html`
          <alert-message type="danger">
            Failed to use microphone input
          </alert-message>
          <transcript-text
            verse-reference=${ifDefined(this.verseReference)}
            transcript=${this.transcript}
          ></transcript-text>
          <div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleRecordButtonClick}
            >
              <span class="circle-icon"></span>
              <span>Try Recording Again</span>
            </button>
          </div>
        `,
      ],
    ])}`;
  }

  connectedCallback() {
    super.connectedCallback();

    this.speechRecognitionService?.addEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_STATE,
      this.#handleSpeechRecognitionStateEvent,
    );
    this.speechRecognitionService?.addEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_INTERIM_TRANSCRIPT,
      this.#handleSpeechRecognitionInterimTranscriptEvent,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.speechRecognitionService?.removeEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_STATE,
      this.#handleSpeechRecognitionStateEvent,
    );
    this.speechRecognitionService?.removeEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_INTERIM_TRANSCRIPT,
      this.#handleSpeechRecognitionInterimTranscriptEvent,
    );

    if (this.speechRecognitionState === SPEECH_RECOGNITION_STATE.LISTENING) {
      this.speechRecognitionService?.stop();
    }
  }

  #handleRecordButtonClick() {
    // reset state
    this.transcript = "";
    this.speechRecognitionState = SPEECH_RECOGNITION_STATE.INITIAL;

    if (window.scrollY < 200) {
      this.scrollIntoView();
    }

    this.speechRecognitionService!.listen().then((finalTranscript) => {
      this.transcript = autoCorrectSpeechRecognitionInput({
        transcript: finalTranscript,
        verseReference: this.verseReference!,
        verseText: this.#verseText,
      });

      this.#sendEventForRecitedBibleVerse(this.transcript);
    });
  }

  #handleStopButtonClick() {
    this.speechRecognitionService!.stop();
  }

  #handleSpeechRecognitionStateEvent = (
    event: CustomEventInit<{ state: SpeechRecognitionState }>,
  ) => {
    const speechRecognitionState = event.detail?.state;
    if (!speechRecognitionState) {
      return;
    }

    this.speechRecognitionState = speechRecognitionState;

    const eventUpdateState = new CustomEvent<{
      state: SpeechRecognitionState;
    }>("state-change", {
      detail: { state: speechRecognitionState },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateState);
  };

  #handleSpeechRecognitionInterimTranscriptEvent = (
    event: CustomEventInit<{ interimTranscript: string }>,
  ) => {
    const interimTranscript = event.detail?.interimTranscript;
    if (interimTranscript && this.verseReference && this.verseContent) {
      this.transcript = autoCorrectSpeechRecognitionInput({
        transcript: interimTranscript,
        verseReference: this.verseReference,
        verseText: this.#verseText,
      });
    }
  };

  #sendEventForRecitedBibleVerse(recitedBibleVerse: string) {
    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENT.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateRecitedBibleVerse);
  }
}

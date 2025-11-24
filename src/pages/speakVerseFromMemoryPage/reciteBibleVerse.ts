import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { choose } from "lit/directives/choose.js";

import { CUSTOM_EVENT } from "../../constants";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATE,
  SPEECH_RECOGNITION_CUSTOM_EVENT,
  type SpeechRecognitionState,
} from "./speechRecognition";
import { convertBibleVerseToText } from "../../services/formatApiResponse";
import { autoCorrectSpeechRecognitionInput } from "./autoCorrectSpokenBibleVerse";
import { ButtonStyles } from "../../components/sharedStyles";

import type { CustomEventUpdateRecitedBibleVerse } from "../../types";

@customElement("recite-bible-verse")
export class ReciteBibleVerse extends LitElement {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @state()
  speechRecognitionState: SpeechRecognitionState =
    SPEECH_RECOGNITION_STATE.INITIAL;

  @state()
  transcript: string = "";

  #textareaInput = "";
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
    ButtonStyles,
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
        margin-top: 2rem;
        margin-bottom: 0;
      }
      button {
        min-width: 7rem;
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
      button .icon {
        margin-right: 0.25rem;
      }
      textarea {
        font: inherit;
        color: inherit;
        width: 100%;
        padding: 1rem;
        background-color: var(--color-primary-mint-cream);
        border: 1px solid var(--color-light-gray);
        border-radius: 1.5rem;
        box-sizing: border-box;
        margin: 2rem 0;
      }
      textarea:focus,
      textarea:active {
        border-color: var(--color-primary-mint-cream);
        outline: 1px solid var(--color-gray);
      }
      textarea:disabled {
        background-color: var(--color-lighter-gray);
        border-color: var(--color-light-gray);
        cursor: not-allowed;
      }
    `,
  ];

  get #verseText() {
    if (!this.verseContent) {
      return "";
    }

    return convertBibleVerseToText(this.verseContent);
  }

  #renderTextarea({ disabled }: { disabled: boolean }) {
    const placeholderText = `Speak or type in ${this.verseReference ?? "the verse reference"} from memory...`;

    const verseWordCount = this.#verseText.split(" ").length;
    const numRows = Math.max(Math.floor(verseWordCount / 6), 3);

    return html`<textarea
      name="transcript-text-input"
      rows=${numRows}
      placeholder=${placeholderText}
      .value=${this.#textareaInput}
      @input=${this.#handleTextareaInput}
      ?disabled=${disabled}
    ></textarea>`;
  }

  render() {
    if (!this.verseReference || !this.verseContent) {
      return null;
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
        () =>
          html`<div class="button-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleRecordButtonClick}
            >
              <span class="icon">&#9679;</span>
              <span class="text-content">Record</span>
            </button>
            ${this.#renderTextarea({ disabled: false })}
          </div>`,
      ],
      [
        WAITING_FOR_MICROPHONE_ACCESS,
        () =>
          html`<alert-message type="warning">
              Waiting for microphone access
            </alert-message>
            <loading-spinner></loading-spinner>
            ${this.#renderTextarea({ disabled: true })}
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleStopButtonClick}
              >
                <span class="icon">&#9632;</span>
                <span class="text-content">Stop</span>
              </button>
            </div>`,
      ],
      [
        LISTENING,
        () =>
          html`<alert-message type="info">
              Recording in progress
            </alert-message>
            <loading-spinner></loading-spinner>
            ${this.#renderTextarea({ disabled: true })}
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleStopButtonClick}
              >
                <span class="icon">&#9632;</span>
                <span class="text-content">Stop</span>
              </button>
            </div>`,
      ],
      [
        AUDIOEND,
        () =>
          html`<alert-message type="info"> Finalizing recording </alert-message>
            <loading-spinner></loading-spinner>
            ${this.#renderTextarea({ disabled: true })}
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Recording Again</span>
              </button>
            </div>`,
      ],
      [
        RESOLVED,
        () =>
          html`<alert-message type="success">
              Recording complete!
            </alert-message>
            ${this.#renderTextarea({ disabled: false })}
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Recording Again</span>
              </button>
            </div>`,
      ],
      [
        REJECTED,
        () =>
          html`<alert-message type="danger">
              Failed to use microphone input
            </alert-message>
            ${this.#renderTextarea({ disabled: false })}
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Recording Again</span>
              </button>
            </div>`,
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
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.#resetState();
    }
  }

  #resetState() {
    this.transcript = "";
    this.#textareaInput = "";
    this.speechRecognitionState = SPEECH_RECOGNITION_STATE.INITIAL;
  }

  #handleRecordButtonClick() {
    this.#resetState();

    if (window.scrollY < 200) {
      this.scrollIntoView();
    }

    this.speechRecognitionService!.listen().then((finalTranscript) => {
      this.transcript = autoCorrectSpeechRecognitionInput({
        transcript: finalTranscript,
        verseReference: this.verseReference!,
        verseText: this.#verseText,
      });

      this.#textareaInput = this.transcript;
      this.#sendEventForRecitedBibleVerse(this.transcript);
    });
  }

  #handleStopButtonClick() {
    this.speechRecognitionService!.stop();
  }

  #handleTextareaInput(event: FocusEvent) {
    this.#textareaInput = (event.target as HTMLTextAreaElement).value;
    this.#sendEventForRecitedBibleVerse(this.#textareaInput);
  }

  #handleSpeechRecognitionStateEvent = (
    event: CustomEventInit<{ state: SpeechRecognitionState }>,
  ) => {
    const speechRecognitionState = event.detail?.state;
    if (speechRecognitionState) {
      this.speechRecognitionState = speechRecognitionState;
    }
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
      this.#textareaInput = this.transcript;
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

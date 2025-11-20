import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { choose } from "lit/directives/choose.js";
import { live } from "lit/directives/live.js";

import { CUSTOM_EVENTS } from "../constants";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATES,
  SPEECH_RECOGNITION_CUSTOM_EVENTS,
  type SpeechRecognitionStates,
} from "../services/speechRecognition";
import { convertBibleVerseToText } from "../services/formatApiResponse";
import { autoCorrectSpeechRecognitionInput } from "../services/autoCorrectSpokenBibleVerse";
import { ButtonStyles } from "./sharedStyles";

import type { CustomEventUpdateRecitedBibleVerse } from "../types";

@customElement("recite-bible-verse")
export class ReciteBibleVerse extends LitElement {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @state()
  speechRecognitionState: SpeechRecognitionStates =
    SPEECH_RECOGNITION_STATES.INITIAL;

  @state()
  interimTranscript: string = "";

  @state()
  finalTranscript: string = "";

  speechRecognitionService?: SpeechRecognitionService;

  constructor() {
    super();

    try {
      this.speechRecognitionService = new SpeechRecognitionService();
    } catch (error) {
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
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
      alert-message {
        margin-bottom: 2rem;
      }
      .button-container {
        text-align: center;
      }
      .transcript-container {
        margin-bottom: 2rem;
        min-height: 8rem;
      }
      button {
        min-width: 7rem;
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
      button .icon {
        margin-right: 0.25rem;
      }
    `,
  ];

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
    } = SPEECH_RECOGNITION_STATES;

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
          </div>`,
      ],
      [
        WAITING_FOR_MICROPHONE_ACCESS,
        () =>
          html`<alert-message type="warning">
              Waiting for microphone access
            </alert-message>
            <loading-spinner></loading-spinner>
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
            <div class="transcript-container">
              <p>${this.interimTranscript}</p>
              <loading-spinner></loading-spinner>
            </div>
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
            <div class="transcript-container">
              <p>${this.interimTranscript}</p>
              <loading-spinner></loading-spinner>
            </div>
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Again</span>
              </button>
            </div>`,
      ],
      [
        RESOLVED,
        () =>
          html`<alert-message type="success">
              Recording complete!
            </alert-message>
            <div class="transcript-container">
              <p
                contenteditable="plaintext-only"
                .innerText=${live(this.finalTranscript)}
                @focusout=${this.#handleFinalTranscriptFocusOut}
              ></p>
            </div>
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Again</span>
              </button>
            </div>`,
      ],
      [
        REJECTED,
        () =>
          html`<alert-message type="danger">
              Failed to use microphone input
            </alert-message>
            <div class="button-container">
              <button
                type="button"
                class="secondary"
                @click=${this.#handleRecordButtonClick}
              >
                <span class="text-content">Try Again</span>
              </button>
            </div>`,
      ],
    ])}`;
  }

  connectedCallback() {
    super.connectedCallback();

    this.speechRecognitionService?.addEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENTS.UPDATE_STATE,
      this.#handleSpeechRecognitionStateEvent,
    );
    this.speechRecognitionService?.addEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENTS.UPDATE_INTERIM_TRANSCRIPT,
      this.#handleSpeechRecognitionInterimTranscriptEvent,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.speechRecognitionService?.removeEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENTS.UPDATE_STATE,
      this.#handleSpeechRecognitionStateEvent,
    );
    this.speechRecognitionService?.removeEventListener(
      SPEECH_RECOGNITION_CUSTOM_EVENTS.UPDATE_INTERIM_TRANSCRIPT,
      this.#handleSpeechRecognitionInterimTranscriptEvent,
    );
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.#resetState();
    }
  }

  #resetState() {
    this.interimTranscript = "";
    this.finalTranscript = "";
    this.speechRecognitionState = SPEECH_RECOGNITION_STATES.INITIAL;
  }

  #handleRecordButtonClick() {
    this.#resetState();

    if (window.scrollY < 200) {
      this.scrollIntoView();
    }

    this.speechRecognitionService!.listen().then((finalTranscript) => {
      this.finalTranscript = autoCorrectSpeechRecognitionInput({
        transcript: finalTranscript,
        verseReference: this.verseReference!,
        verseText: convertBibleVerseToText(this.verseContent!),
      });

      this.#sendEventForRecitedBibleVerse(this.finalTranscript);
    });
  }

  #handleStopButtonClick() {
    this.speechRecognitionService!.stop();
  }

  #handleFinalTranscriptFocusOut(event: FocusEvent) {
    const target = event.target as HTMLParagraphElement;
    if (!target?.innerText || target.innerText === this.finalTranscript) {
      return;
    }

    this.finalTranscript = target.innerText;
    this.#sendEventForRecitedBibleVerse(this.finalTranscript);
  }

  #handleSpeechRecognitionStateEvent = (
    event: CustomEventInit<{ state: SpeechRecognitionStates }>,
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
      this.interimTranscript = autoCorrectSpeechRecognitionInput({
        transcript: interimTranscript,
        verseReference: this.verseReference,
        verseText: convertBibleVerseToText(this.verseContent),
      });
    }
  };

  #sendEventForRecitedBibleVerse(recitedBibleVerse: string) {
    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateRecitedBibleVerse);
  }
}

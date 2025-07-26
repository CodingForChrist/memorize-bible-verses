import {
  CUSTOM_EVENTS,
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "../constants";

import { buttonStyles } from "../sharedStyles";
import { convertBibleVerseToText } from "../formatBibleVerseFromApi";
import { normalizeSpeechRecognitionInput } from "../normalizeSpeechRecognitionInput";

import type {
  CustomEventUpdateRecitedBibleVerse,
  CustomEventNavigateToStep,
} from "../types";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognition: SpeechRecognition;
  #speechTranscript?: string;
  #lastSpeechRecognitionResult?: SpeechRecognitionResultList;
  #speechRecognitionState: SpeechRecognitionStates;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(this.#containerElements);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.interimResults = true;
    this.speechRecognition.maxAlternatives = 5;

    this.#speechRecognitionState = SPEECH_RECOGNITION_STATES.INITIAL;
  }

  static get observedAttributes() {
    return ["verse-reference"];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get verseContent() {
    return this.getAttribute("verse-content");
  }

  get speechRecognitionState() {
    return this.#speechRecognitionState;
  }

  set speechRecognitionState(value: SpeechRecognitionStates) {
    this.#speechRecognitionState = value;

    if (value === SPEECH_RECOGNITION_STATES.RESOLVED) {
      this.#hideLoadingSpinner();
      const eventNavigateToStep2 = new CustomEvent<CustomEventNavigateToStep>(
        CUSTOM_EVENTS.NAVIGATE_TO_STEP,
        {
          detail: { stepNumber: 3 },
          bubbles: true,
          composed: true,
        },
      );
      window.dispatchEvent(eventNavigateToStep2);
      this.#recordVoiceButton.textContent =
        "Start recording with microphone input";
      this.#interimResultsParagraphElement.innerText = "";
    } else if (value === SPEECH_RECOGNITION_STATES.REJECTED) {
      this.#hideLoadingSpinner();
      this.#renderErrorMessage("Failed to use microphone input");
      this.#recordVoiceButton.textContent =
        "Start recording with microphone input";
      this.#interimResultsParagraphElement.innerText = "";
    }
  }

  get #initialContentContainerElement() {
    return this.shadowRoot!.querySelector(
      "#initial-content-container",
    ) as HTMLDivElement;
  }

  get #resultsContainerElement() {
    return this.shadowRoot!.querySelector(
      "#results-container",
    ) as HTMLDivElement;
  }

  get #interimResultsParagraphElement() {
    return this.#resultsContainerElement.querySelector(
      "p",
    ) as HTMLParagraphElement;
  }

  get #recordVoiceButton() {
    return this.#initialContentContainerElement.querySelector(
      "button",
    ) as HTMLButtonElement;
  }

  #showLoadingSpinner() {
    const loadingSpinnerElement = document.createElement("loading-spinner");
    this.#resultsContainerElement.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    this.#resultsContainerElement.querySelector("loading-spinner")?.remove();
  }

  get speechTranscript(): string | undefined {
    return this.#speechTranscript;
  }

  set speechTranscript(value: SpeechRecognitionResultList) {
    const transcriptArray = [];

    for (const result of value) {
      transcriptArray.push(result[0].transcript);
    }

    this.#speechTranscript = transcriptArray.join(" ");

    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse: this.#speechTranscript },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateRecitedBibleVerse);
  }

  #renderInitialContent() {
    if (!this.verseReference) {
      return this.#renderErrorMessage(
        "Go back to Step 1 and select a bible verse reference.",
      );
    }

    this.#initialContentContainerElement.innerHTML = `
      <p>Click the button below and recite ${this.verseReference}</p>
      <button class="button-primary">Start recording with microphone input</button>
    `;

    this.#initialContentContainerElement
      .querySelector("button")!
      .addEventListener("click", this.#recordVoiceButtonClick.bind(this));
  }

  #recordVoiceButtonClick(event: Event) {
    const buttonElement = event.target as HTMLButtonElement;

    const {
      INITIAL,
      WAITING_FOR_MICROPHONE_ACCESS,
      LISTENING,
      RESOLVED,
      REJECTED,
    } = SPEECH_RECOGNITION_STATES;

    if (
      ([INITIAL, RESOLVED, REJECTED] as SpeechRecognitionStates[]).includes(
        this.speechRecognitionState,
      )
    ) {
      this.speechRecognition.start();
      this.speechRecognitionState =
        SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS;
      buttonElement.textContent = "Click again to stop recording";
      this.#showLoadingSpinner();
    } else if (this.speechRecognitionState === LISTENING) {
      this.speechRecognition.stop();
      buttonElement.textContent = "Recording complete!";
    } else if (this.speechRecognitionState === WAITING_FOR_MICROPHONE_ACCESS) {
      this.speechRecognition.stop();
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
    }
  }

  #printSpeechRecognitionInterimResults(results: SpeechRecognitionResultList) {
    if (!results || !this.verseReference || !this.verseContent) {
      return;
    }

    let interimTranscript = "";
    for (const result of results) {
      interimTranscript += result[0].transcript;
    }

    this.#interimResultsParagraphElement.innerText =
      normalizeSpeechRecognitionInput({
        transcript: interimTranscript,
        verseReference: this.verseReference,
        verseText: convertBibleVerseToText(this.verseContent),
      });
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;

    this.#initialContentContainerElement.innerHTML = "";
    this.#initialContentContainerElement.appendChild(alertErrorElement);
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <div id="initial-content-container"></div>
      <div id="results-container">
        <p></p>
      </div>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        display: block;
      }
      p {
        margin: 1rem 0;
      }
      .button-primary {
        width: 100%;
      }
      ${buttonStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.#renderInitialContent();

    this.speechRecognition.addEventListener("start", () => {
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.LISTENING;
    });

    this.speechRecognition.addEventListener(
      "result",
      (event: SpeechRecognitionEvent) => {
        console.log({
          label: "speechRecognitionResults",
          results: event.results,
        });

        this.#printSpeechRecognitionInterimResults(event.results);
        this.#lastSpeechRecognitionResult = event.results;
      },
    );

    this.speechRecognition.addEventListener("end", () => {
      if (this.#lastSpeechRecognitionResult) {
        this.speechTranscript = this.#lastSpeechRecognitionResult;
        this.speechRecognitionState = SPEECH_RECOGNITION_STATES.RESOLVED;
      } else {
        this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
      }
    });
  }

  attributeChangedCallback(name: string) {
    if (name !== "verse-reference") {
      return;
    }
    this.#renderInitialContent();
  }
}

window.customElements.define("recite-bible-verse", ReciteBibleVerse);

import {
  CUSTOM_EVENTS,
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "../constants";

import { convertBibleVerseToText } from "../formatBibleVerseFromApi";
import { normalizeSpeechRecognitionInput } from "../normalizeSpeechRecognitionInput";

import type { CustomEventUpdateRecitedBibleVerse } from "../types";

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

    if (value === SPEECH_RECOGNITION_STATES.REJECTED) {
      this.#hideLoadingSpinner();
      this.#renderErrorMessage("Failed to use microphone input");
      this.#showTryAgainButton();
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

  get #recordingControlsContainerElement() {
    return this.shadowRoot!.querySelector(
      "#recording-controls-container",
    ) as HTMLDivElement;
  }

  get #interimResultsParagraphElement() {
    return this.#resultsContainerElement.querySelector(
      "p",
    ) as HTMLParagraphElement;
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
    // clear out existing content
    this.#interimResultsParagraphElement.innerText = "";
    this.#recordingControlsContainerElement.innerHTML = "";

    if (!this.verseReference) {
      return this.#renderErrorMessage(
        "Go back to Step 1 and select a bible verse.",
      );
    }

    this.#initialContentContainerElement.innerHTML = `
      <h2>${this.verseReference}</h2>
      <branded-button
        id="button-record"
        type="button"
        brand="secondary"
        text-content="&#9679; RECORD">
      </branded-button>
    `;

    this.#initialContentContainerElement
      .querySelector("#button-record")!
      .addEventListener("click", this.#recordVoiceButtonClick.bind(this));
  }

  #recordVoiceButtonClick() {
    const { INITIAL, RESOLVED, REJECTED } = SPEECH_RECOGNITION_STATES;

    if (
      ([INITIAL, RESOLVED, REJECTED] as SpeechRecognitionStates[]).includes(
        this.speechRecognitionState,
      )
    ) {
      this.speechRecognition.start();
      this.speechRecognitionState =
        SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS;
      this.#showLoadingSpinner();
      this.#showStopButton();
    }
  }

  #showStopButton() {
    this.#recordingControlsContainerElement.innerHTML = `
      <branded-button
        id="button-stop"
        type="button"
        brand="secondary"
        text-content="&#9632; Stop">
      </branded-button>
    `;

    this.#recordingControlsContainerElement
      .querySelector("#button-stop")!
      .addEventListener("click", this.#stopRecordingButtonClick.bind(this));
  }

  #showTryAgainButton() {
    this.#recordingControlsContainerElement.innerHTML = `
      <branded-button
        id="button-try-again"
        type="button"
        brand="secondary"
        text-content="Try Again">
      </branded-button>
    `;

    this.#recordingControlsContainerElement
      .querySelector("#button-try-again")!
      .addEventListener("click", () => {
        this.#interimResultsParagraphElement.innerText = "";
        this.#recordVoiceButtonClick();
      });
  }

  #stopRecordingButtonClick() {
    const { WAITING_FOR_MICROPHONE_ACCESS, LISTENING } =
      SPEECH_RECOGNITION_STATES;

    if (this.speechRecognitionState === LISTENING) {
      this.speechRecognition.stop();
      this.#hideLoadingSpinner();
      this.#showTryAgainButton();
    } else if (this.speechRecognitionState === WAITING_FOR_MICROPHONE_ACCESS) {
      this.speechRecognition.stop();
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
      this.#showTryAgainButton();
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
    divElement.id = "parent-container";
    divElement.innerHTML = `
      <div id="initial-content-container"></div>
      <div id="results-container">
        <p></p>
      </div>
      <div id="recording-controls-container"></div>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      #parent-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
      #initial-content-container {
        text-align: center;
      }
      #results-container {
        margin: 2rem 0;
        min-height: 10rem;
      }
      #recording-controls-container {
        text-align: center;
      }
      branded-button {
        min-width: 7rem;
      }
      h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        font-size: 1.5rem;
      }
      alert-error {
        text-align: left;
      }
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

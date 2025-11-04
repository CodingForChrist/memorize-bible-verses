import { CUSTOM_EVENTS } from "../constants";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "../services/speechRecognition";
import { convertBibleVerseToText } from "../services/formatApiResponse";
import { autoCorrectSpeechRecognitionInput } from "../services/autoCorrectSpokenBibleVerse";

import type { CustomEventUpdateRecitedBibleVerse } from "../types";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognitionService?: SpeechRecognitionService;
  #speechTranscript?: string;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(this.#containerElements);
    try {
      this.speechRecognitionService = new SpeechRecognitionService();
    } catch (error) {
      console.error("Unable to use the SpeechRecognition API", error);
    }
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
      "#transcript-pararaph",
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

  set speechTranscript(value: string) {
    this.#speechTranscript = value;

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
    this.speechTranscript = "";

    this.#initialContentContainerElement.innerHTML = `
      <branded-button id="button-record" type="button" brand="secondary">
        <span slot="button-text">
          <span class="icon">&#9679;</span>
          <span class="text-content">Record</span>
        </span>
      </branded-button>
    `;

    this.#initialContentContainerElement
      .querySelector("#button-record")!
      .addEventListener("click", this.#recordVoiceButtonClick.bind(this));
  }

  #updateSpeechRecognitionAlertMessage() {
    const state = this.speechRecognitionService!.state;
    const { LISTENING, WAITING_FOR_MICROPHONE_ACCESS, RESOLVED, REJECTED } =
      SPEECH_RECOGNITION_STATES;

    if (state === WAITING_FOR_MICROPHONE_ACCESS) {
      return this.#renderAlertMessage({
        type: "warning",
        message: "Waiting for microphone access",
      });
    }
    if (state === LISTENING) {
      return this.#renderAlertMessage({
        type: "info",
        message: "Recording in progress",
      });
    }
    if (state === RESOLVED) {
      return this.#renderAlertMessage({
        type: "success",
        message: "Recording complete!",
      });
    }
    if (state === REJECTED) {
      return this.#renderAlertMessage({
        type: "danger",
        message: "Failed to use microphone input",
      });
    }
  }

  async #recordVoiceButtonClick() {
    const { INITIAL, RESOLVED, REJECTED } = SPEECH_RECOGNITION_STATES;

    if (
      ([INITIAL, RESOLVED, REJECTED] as SpeechRecognitionStates[]).includes(
        this.speechRecognitionService!.state,
      )
    ) {
      this.#showLoadingSpinner();
      this.#showStopButton();

      this.#initialContentContainerElement.scrollIntoView();
      this.#initialContentContainerElement
        .querySelector("#button-record")
        ?.remove();

      const intervalForPrintingInterimResults = setInterval(() => {
        this.#printSpeechRecognitionInterimResults(
          this.speechRecognitionService!.interimTranscript,
        );
        this.#updateSpeechRecognitionAlertMessage();
      }, 200);

      try {
        const finalTranscript = await this.speechRecognitionService!.listen();
        this.speechTranscript = finalTranscript;
        clearInterval(intervalForPrintingInterimResults);
        this.#printSpeechRecognitionInterimResults(finalTranscript);
        this.#updateSpeechRecognitionAlertMessage();
      } catch (_error) {
        this.#hideLoadingSpinner();
        this.#updateSpeechRecognitionAlertMessage();
        this.#showTryAgainButton();
        this.#interimResultsParagraphElement.innerText = "";
        clearInterval(intervalForPrintingInterimResults);
      }
    }
  }

  #showStopButton() {
    this.#recordingControlsContainerElement.innerHTML = `
      <branded-button id="button-stop" type="button" brand="secondary">
        <span slot="button-text">
          <span class="icon">&#9632;</span>
          <span class="text-content">Stop</span>
        </span>
      </branded-button>
    `;

    this.#recordingControlsContainerElement
      .querySelector("#button-stop")!
      .addEventListener("click", this.#stopRecordingButtonClick.bind(this));
  }

  #showTryAgainButton() {
    this.#recordingControlsContainerElement.innerHTML = `
      <branded-button id="button-try-again" type="button" brand="secondary">
        <span slot="button-text">Try Again</span>
      </branded-button>
    `;

    this.#recordingControlsContainerElement
      .querySelector("#button-try-again")!
      .addEventListener("click", () => {
        this.#renderInitialContent();
        this.#recordVoiceButtonClick();
      });
  }

  #stopRecordingButtonClick() {
    this.speechRecognitionService!.stop();
    this.#hideLoadingSpinner();
    this.#showTryAgainButton();
  }

  #printSpeechRecognitionInterimResults(transcript?: string) {
    if (!transcript || !this.verseReference || !this.verseContent) {
      return;
    }

    this.#interimResultsParagraphElement.innerText =
      autoCorrectSpeechRecognitionInput({
        transcript,
        verseReference: this.verseReference,
        verseText: convertBibleVerseToText(this.verseContent),
      });
  }

  #renderAlertMessage({ type, message }: { type: string; message: string }) {
    // clear container content
    this.#initialContentContainerElement.innerHTML = "";

    const alertMessageElement = document.createElement("alert-message");
    alertMessageElement.setAttribute("type", type);
    alertMessageElement.innerHTML = `
      <span slot="alert-message">${message}</span>
    `;

    this.#initialContentContainerElement.appendChild(alertMessageElement);
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.id = "parent-container";
    divElement.innerHTML = `
      <div id="initial-content-container"></div>
      <div id="results-container"></div>
      <div id="recording-controls-container"></div>
    `;

    divElement
      .querySelector("#results-container")
      ?.appendChild(this.#editableTranscriptParagraphElement);

    return divElement;
  }

  get #editableTranscriptParagraphElement() {
    const paragraphElement = document.createElement("p");
    paragraphElement.id = "transcript-pararaph";
    paragraphElement.setAttribute("contenteditable", "plaintext-only");

    let shouldFireChange = false;

    paragraphElement.addEventListener("input", () => {
      shouldFireChange = true;
    });

    paragraphElement.addEventListener("focusout", () => {
      if (shouldFireChange) {
        this.speechTranscript = paragraphElement.innerText;
        shouldFireChange = false;
      }
    });

    return paragraphElement;
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
      branded-button .icon {
        margin-right: 0.25rem;
      }
      #button-record,
      #button-stop,
      #button-try-again {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.#renderInitialContent();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "verse-reference" && oldValue !== newValue) {
      return this.#renderInitialContent();
    }
  }
}

window.customElements.define("recite-bible-verse", ReciteBibleVerse);

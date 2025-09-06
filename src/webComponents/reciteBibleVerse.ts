import {
  CUSTOM_EVENTS,
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "../constants";

import { SpeechRecognitionService } from "../speechRecognitionService";
import { convertBibleVerseToText } from "../formatBibleVerseFromApi";
import { normalizeSpeechRecognitionInput } from "../normalizeSpeechRecognitionInput";

import type { CustomEventUpdateRecitedBibleVerse } from "../types";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognitionService: SpeechRecognitionService;
  #speechTranscript?: string;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(this.#containerElements);

    this.speechRecognitionService = new SpeechRecognitionService();
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

  get #alertErrorElement() {
    return this.#initialContentContainerElement.querySelector("alert-error");
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

  #hasSupportForSpeechRecognition() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  #renderInitialContent() {
    // clear out existing content
    this.#interimResultsParagraphElement.innerText = "";
    this.#recordingControlsContainerElement.innerHTML = "";
    this.speechTranscript = "";

    if (!this.#hasSupportForSpeechRecognition()) {
      return this.#renderErrorMessage(
        "Your browser does not support the Web Speech API. Please try another browser like Chrome or Safari.",
      );
    }

    if (!this.verseReference) {
      return this.#renderErrorMessage(
        "Go back to Step 1 and select a bible verse.",
      );
    }

    this.#initialContentContainerElement.innerHTML = `
      <h2>${this.verseReference}</h2>
      <branded-button id="button-record" type="button" brand="secondary">
        <span slot="button-text">&#9679; RECORD</span>
      </branded-button>
    `;

    this.#initialContentContainerElement
      .querySelector("#button-record")!
      .addEventListener("click", this.#recordVoiceButtonClick.bind(this));
  }

  async #recordVoiceButtonClick() {
    const { INITIAL, RESOLVED, REJECTED } = SPEECH_RECOGNITION_STATES;

    if (
      ([INITIAL, RESOLVED, REJECTED] as SpeechRecognitionStates[]).includes(
        this.speechRecognitionService.state,
      )
    ) {
      this.#showLoadingSpinner();
      this.#showStopButton();
      this.#initialContentContainerElement
        .querySelector("#button-record")
        ?.scrollIntoView();

      const intervalForPrintingInterimResults = setInterval(() => {
        this.#printSpeechRecognitionInterimResults(
          this.speechRecognitionService.interimTranscript,
        );
      }, 100);

      try {
        const finalTranscript = await this.speechRecognitionService.listen();
        this.speechTranscript = finalTranscript;
        clearInterval(intervalForPrintingInterimResults);
        this.#printSpeechRecognitionInterimResults(finalTranscript);
      } catch (_error) {
        this.#hideLoadingSpinner();
        this.#renderErrorMessage("Failed to use microphone input");
        this.#showTryAgainButton();
        this.#interimResultsParagraphElement.innerText = "";
        clearInterval(intervalForPrintingInterimResults);
      }
    }
  }

  #showStopButton() {
    this.#recordingControlsContainerElement.innerHTML = `
      <branded-button id="button-stop" type="button" brand="secondary">
        <span slot="button-text">&#9632; Stop</span>
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
        this.#interimResultsParagraphElement.innerText = "";
        this.#alertErrorElement?.remove();
        this.#recordVoiceButtonClick();
      });
  }

  #stopRecordingButtonClick() {
    this.speechRecognitionService.stop();
    this.#hideLoadingSpinner();
    this.#showTryAgainButton();
  }

  #printSpeechRecognitionInterimResults(transcript?: string) {
    if (!transcript || !this.verseReference || !this.verseContent) {
      return;
    }

    this.#interimResultsParagraphElement.innerText =
      normalizeSpeechRecognitionInput({
        transcript,
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
      h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        font-weight: 400;
      }
      alert-error {
        text-align: left;
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

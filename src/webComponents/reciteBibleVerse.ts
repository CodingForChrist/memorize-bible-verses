import { getTemplate } from "./utils";
import {
  CUSTOM_EVENTS,
  LOADING_STATES,
  type LoadingStates,
} from "../constants";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognition: SpeechRecognition;
  #speechTranscript?: string;
  #lastSpeechRecognitionResult?: SpeechRecognitionResultList;
  #speechRecognitionState: LoadingStates;

  constructor() {
    super();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.interimResults = false;
    this.speechRecognition.maxAlternatives = 5;

    this.#speechRecognitionState = LOADING_STATES.INITIAL;
  }

  static get observedAttributes() {
    return ["verse-reference"];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get speechRecognitionState() {
    return this.#speechRecognitionState;
  }

  set speechRecognitionState(value: LoadingStates) {
    this.#speechRecognitionState = value;

    if (value === LOADING_STATES.RESOLVED) {
      this.#hideLoadingSpinner();
      const eventNavigateToStep2 = new CustomEvent(
        CUSTOM_EVENTS.NAVIGATE_TO_STEP,
        {
          detail: { step: "3" },
        },
      );
      window.dispatchEvent(eventNavigateToStep2);
    } else if (value === LOADING_STATES.REJECTED) {
      this.#renderErrorMessage("Failed to use microphone input");
    }
  }

  #showLoadingSpinner() {
    this.appendChild(getTemplate("loading-spinner-template"));
  }

  #hideLoadingSpinner() {
    const loadingSpinner = this.querySelector(
      '[data-template-id="loading-spinner"]',
    );
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
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

    const eventUpdateRecitedBibleVerse = new CustomEvent(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      {
        detail: { recitedBibleVerse: this.#speechTranscript },
      },
    );
    window.dispatchEvent(eventUpdateRecitedBibleVerse);
  }

  #renderInitialContent() {
    this.innerHTML = "";

    if (this.verseReference) {
      const paragraphElement = document.createElement("p");
      paragraphElement.innerText = `Click the button below and recite ${this.verseReference}`;
      paragraphElement.classList.add("mb-4");
      this.append(paragraphElement);
      this.#renderRecordVoiceButton();
    } else {
      this.#renderErrorMessage(
        "Go back to Step 1 and select a bible verse reference.",
      );
    }
  }

  #renderRecordVoiceButton() {
    const html = `
        <button type="button" id="button-record-voice" class="flex-none mt-1 z-1 bg-blue-600 px-4 py-2 w-full text-sm/6 font-semibold text-white cursor-pointer hover:bg-blue-800">
          Start recording with microphone input
        </button>
    `;

    const divContainer = document.createElement("div");
    divContainer.innerHTML = html;

    const buttonRecordVoice = divContainer.querySelector(
      "#button-record-voice",
    ) as HTMLButtonElement;

    buttonRecordVoice.onclick = () => {
      if (this.speechRecognitionState === LOADING_STATES.PENDING) {
        this.speechRecognition.stop();
        buttonRecordVoice.textContent = "Recording complete!";
      } else {
        this.speechRecognition.start();
        buttonRecordVoice.textContent = "Click again to stop recording";
        this.#showLoadingSpinner();
      }
    };

    this.append(divContainer);
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = getTemplate("alert-error-template");
    const errorMessageSlot = alertErrorElement.querySelector<HTMLSlotElement>(
      'slot[name="error-message"]',
    );

    if (errorMessageSlot) {
      errorMessageSlot.innerText = message;
      this.append(alertErrorElement);
    }
  }

  connectedCallback() {
    this.#renderInitialContent();

    this.speechRecognition.addEventListener(
      "result",
      (event: SpeechRecognitionEvent) => {
        console.log({
          label: "speechRecognitionResults",
          results: event.results,
        });
        this.#lastSpeechRecognitionResult = event.results;
        this.speechRecognitionState = LOADING_STATES.PENDING;
      },
    );

    this.speechRecognition.addEventListener("end", () => {
      if (this.#lastSpeechRecognitionResult) {
        this.speechTranscript = this.#lastSpeechRecognitionResult;
        this.speechRecognitionState = LOADING_STATES.RESOLVED;
      } else {
        this.speechRecognitionState = LOADING_STATES.REJECTED;
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

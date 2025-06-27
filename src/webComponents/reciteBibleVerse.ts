import {
  CUSTOM_EVENTS,
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "../constants";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognition: SpeechRecognition;
  #speechTranscript?: string;
  #lastSpeechRecognitionResult?: SpeechRecognitionResultList;
  #speechRecognitionState: SpeechRecognitionStates;

  constructor() {
    super();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.interimResults = false;
    this.speechRecognition.maxAlternatives = 5;

    this.#speechRecognitionState = SPEECH_RECOGNITION_STATES.INITIAL;
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

  set speechRecognitionState(value: SpeechRecognitionStates) {
    this.#speechRecognitionState = value;

    if (value === SPEECH_RECOGNITION_STATES.RESOLVED) {
      this.#hideLoadingSpinner();
      const eventNavigateToStep2 = new CustomEvent(
        CUSTOM_EVENTS.NAVIGATE_TO_STEP,
        {
          detail: { step: "3" },
        },
      );
      window.dispatchEvent(eventNavigateToStep2);
      if (this.#recordVoiceButton) {
        this.#recordVoiceButton.textContent =
          "Start recording with microphone input";
      }
    } else if (value === SPEECH_RECOGNITION_STATES.REJECTED) {
      this.#hideLoadingSpinner();
      this.#renderErrorMessage("Failed to use microphone input");
      if (this.#recordVoiceButton) {
        this.#recordVoiceButton.textContent =
          "Start recording with microphone input";
      }
    }
  }

  #showLoadingSpinner() {
    const loadingSpinnerElement = document.createElement("loading-spinner");
    loadingSpinnerElement.classList.add("my-4");
    this.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    const loadingSpinner = this.querySelector("loading-spinner");
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
    if (this.verseReference) {
      const html = `
        <p class="mb-4">
          Click the button below and recite ${this.verseReference}
        </p>
        <div id="button-record-voice-container"></div>
        <div id="speech-recognition-error-container"></div>
    `;
      this.innerHTML = html;
      this.querySelector("#button-record-voice-container")?.append(
        this.#createRecordVoiceButton(),
      );
    } else {
      this.innerHTML = '<div id="speech-recognition-error-container"></div>';
      this.#renderErrorMessage(
        "Go back to Step 1 and select a bible verse reference.",
      );
    }
  }

  get #recordVoiceButton() {
    return this.querySelector<HTMLButtonElement>("#button-record-voice");
  }

  #createRecordVoiceButton() {
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
        buttonRecordVoice.textContent = "Click again to stop recording";
        this.#showLoadingSpinner();
      } else if (this.speechRecognitionState === LISTENING) {
        this.speechRecognition.stop();
        buttonRecordVoice.textContent = "Recording complete!";
      } else if (
        this.speechRecognitionState === WAITING_FOR_MICROPHONE_ACCESS
      ) {
        this.speechRecognition.stop();
        this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
      }
    };

    return divContainer;
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;

    const errorMessageContainer = this.querySelector(
      "#speech-recognition-error-container",
    );

    if (errorMessageContainer) {
      errorMessageContainer.innerHTML = "";
      errorMessageContainer.appendChild(alertErrorElement);
    }
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

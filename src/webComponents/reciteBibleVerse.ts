import { getTemplate } from "./utils";
import { CUSTOM_EVENTS } from "../constants";

export class ReciteBibleVerse extends HTMLElement {
  speechRecognition: SpeechRecognition;
  #speechTranscript?: string;
  #lastSpeechRecognitionResult?: SpeechRecognitionResultList;

  #templates: {
    loadingSpinner: DocumentFragment;
  };

  constructor() {
    super();

    this.#templates = {
      loadingSpinner: getTemplate("loading-spinner-template"),
    };

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.interimResults = false;
    this.speechRecognition.maxAlternatives = 1;
  }

  #showLoadingSpinner() {
    this.appendChild(this.#templates.loadingSpinner);
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

    const eventUpdateSelectedBible = new CustomEvent(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      {
        detail: { recitedBibleVerse: this.#speechTranscript },
      },
    );
    window.dispatchEvent(eventUpdateSelectedBible);
  }

  #renderRecordVoiceButton() {
    const html = `
        <button type="button" id="button-record-voice" class="flex-none mt-1 z-1 bg-blue-600 px-4 py-2 w-full text-sm/6 font-semibold text-white hover:bg-blue-800">
          Start recording with microphone input
        </button>
    `;

    const divContainer = document.createElement("div");
    divContainer.innerHTML = html;

    const buttonRecordVoice = divContainer.querySelector(
      "#button-record-voice",
    ) as HTMLButtonElement;

    buttonRecordVoice.onclick = () => {
      if (buttonRecordVoice.hasAttribute("recording-in-progress")) {
        this.speechRecognition.stop();
        buttonRecordVoice.textContent = "Recording complete!";
        buttonRecordVoice.removeAttribute("recording-in-progress");
        this.#hideLoadingSpinner();
      } else {
        this.speechRecognition.start();
        buttonRecordVoice.textContent = "Click again to stop recording";
        buttonRecordVoice.setAttribute("recording-in-progress", "true");
        this.#showLoadingSpinner();
      }
    };

    this.append(divContainer);
  }

  connectedCallback() {
    this.#renderRecordVoiceButton();

    this.speechRecognition.addEventListener(
      "result",
      (event: SpeechRecognitionEvent) => {
        this.#lastSpeechRecognitionResult = event.results;
      },
    );

    this.speechRecognition.addEventListener("end", () => {
      if (this.#lastSpeechRecognitionResult) {
        this.speechTranscript = this.#lastSpeechRecognitionResult;
      }
    });
  }
}

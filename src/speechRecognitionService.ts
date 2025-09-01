import {
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "./constants";

export class SpeechRecognitionService {
  speechRecognition?: SpeechRecognition;
  interimTranscript?: string;
  finalTranscript?: string;
  speechRecognitionState: SpeechRecognitionStates;
  #lastSpeechRecognitionResult?: SpeechRecognitionResultList;
  #resolveListener?: (value: string) => void;
  #rejectListener?: (reason: string) => void;

  constructor() {
    this.speechRecognitionState = SPEECH_RECOGNITION_STATES.INITIAL;

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.lang = "en-US";
      this.speechRecognition.interimResults = true;
      this.speechRecognition.maxAlternatives = 1;
    } catch (error) {
      console.error("Unable to use the SpeechRecognition API", error);
    }
  }

  listen() {
    return new Promise<string>((resolve, reject) => {
      // resolve or reject get invoked in the "end" event
      this.#resolveListener = resolve;
      this.#rejectListener = reject;

      this.speechRecognition?.start();
      this.speechRecognitionState =
        SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS;
    });
  }

  stop() {
    this.speechRecognition?.stop();
    if (
      this.speechRecognitionState ===
      SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS
    ) {
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.REJECTED;
    } else {
      this.speechRecognitionState = SPEECH_RECOGNITION_STATES.RESOLVED;
    }
  }

  #getTranscriptAsText(results: SpeechRecognitionResultList) {
    let transcriptArray: string[] = [];

    for (const result of Array.from(results)) {
      // attempt to avoid duplicate words for android chrome
      if (result[0].confidence > 0) {
        transcriptArray.push(result[0].transcript.trim());
      }
    }

    return transcriptArray.join(" ");
  }

  #onStart() {
    this.speechRecognitionState = SPEECH_RECOGNITION_STATES.LISTENING;
  }

  #onResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = this.#getTranscriptAsText(event.results);
    this.#lastSpeechRecognitionResult = event.results;
  }

  #onEnd() {
    if (this.speechRecognitionState === SPEECH_RECOGNITION_STATES.LISTENING) {
      // restart for android chrome which can abruptly end early
      this.speechRecognition?.stop();
      this.speechRecognition?.start();
      return;
    }

    if (
      this.speechRecognitionState === SPEECH_RECOGNITION_STATES.RESOLVED &&
      this.#lastSpeechRecognitionResult
    ) {
      const transcript = this.#getTranscriptAsText(
        this.#lastSpeechRecognitionResult,
      );
      this.interimTranscript = transcript;
      this.finalTranscript = transcript;

      if (this.#resolveListener) {
        this.#resolveListener(this.finalTranscript);
      }
    } else {
      if (this.#rejectListener) {
        this.#rejectListener("Failed to get final transcript");
      }
    }
  }

  connectedCallback() {
    this.speechRecognition?.addEventListener("start", this.#onStart.bind(this));
    this.speechRecognition?.addEventListener(
      "result",
      this.#onResult.bind(this),
    );
    this.speechRecognition?.addEventListener("end", this.#onEnd.bind(this));
  }
}

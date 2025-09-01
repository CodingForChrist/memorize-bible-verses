import {
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "./constants";

export class SpeechRecognitionService {
  interimTranscript?: string;
  finalTranscript?: string;
  state: SpeechRecognitionStates;
  #recognition?: SpeechRecognition;
  #lastResult?: SpeechRecognitionResultList;
  #resolveListener?: (value: string) => void;
  #rejectListener?: (reason: string) => void;

  constructor() {
    this.state = SPEECH_RECOGNITION_STATES.INITIAL;

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.#recognition = new SpeechRecognition();
      this.#recognition.continuous = true;
      this.#recognition.lang = "en-US";
      this.#recognition.interimResults = true;
      this.#recognition.maxAlternatives = 1;

      this.#recognition?.addEventListener("start", this.#onStart.bind(this));
      this.#recognition?.addEventListener("result", this.#onResult.bind(this));
      this.#recognition?.addEventListener("end", this.#onEnd.bind(this));
    } catch (error) {
      console.error("Unable to use the SpeechRecognition API", error);
    }
  }

  listen() {
    return new Promise<string>((resolve, reject) => {
      // resolve or reject get invoked in the "end" event
      this.#resolveListener = resolve;
      this.#rejectListener = reject;

      this.#recognition?.start();
      this.state = SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS;
    });
  }

  stop() {
    this.#recognition?.stop();
    if (
      this.state === SPEECH_RECOGNITION_STATES.WAITING_FOR_MICROPHONE_ACCESS
    ) {
      this.state = SPEECH_RECOGNITION_STATES.REJECTED;
    } else {
      this.state = SPEECH_RECOGNITION_STATES.RESOLVED;
    }
  }

  #getTranscriptAsText(results: SpeechRecognitionResultList) {
    let transcriptArray: string[] = [];

    for (const [index, value] of Array.from(results).entries()) {
      const { confidence, transcript } = value[0];
      // attempt to avoid duplicate phrases for android chrome
      if (confidence === 0 && transcript === transcriptArray[index - 1]) {
        continue;
      }

      transcriptArray.push(transcript.trim());
    }
    return transcriptArray.join(" ");
  }

  #onStart() {
    this.state = SPEECH_RECOGNITION_STATES.LISTENING;
  }

  #onResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = this.#getTranscriptAsText(event.results);
    this.#lastResult = event.results;
  }

  #onEnd() {
    if (this.state === SPEECH_RECOGNITION_STATES.LISTENING) {
      // restart for android chrome which can abruptly end early
      this.#recognition?.stop();
      this.#recognition?.start();
      return;
    }

    if (this.state === SPEECH_RECOGNITION_STATES.RESOLVED && this.#lastResult) {
      const transcript = this.#getTranscriptAsText(this.#lastResult);
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
}

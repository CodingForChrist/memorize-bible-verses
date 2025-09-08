import {
  SPEECH_RECOGNITION_STATES,
  type SpeechRecognitionStates,
} from "./constants";

const {
  INITIAL,
  WAITING_FOR_MICROPHONE_ACCESS,
  LISTENING,
  RESOLVED,
  REJECTED,
} = SPEECH_RECOGNITION_STATES;

export class SpeechRecognitionService {
  interimTranscript?: string;
  finalTranscript?: string;
  #transcriptHistory: string[];
  state: SpeechRecognitionStates;
  #recognition?: SpeechRecognition;
  #lastResult?: SpeechRecognitionResultList;
  #resolveListener?: (value: string) => void;
  #rejectListener?: (reason: string) => void;

  constructor() {
    this.state = INITIAL;
    this.#transcriptHistory = [];

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
    this.#resetState();

    return new Promise<string>((resolve, reject) => {
      // resolve or reject get invoked in the "end" event
      this.#resolveListener = resolve;
      this.#rejectListener = reject;

      this.#recognition?.start();
      this.state = WAITING_FOR_MICROPHONE_ACCESS;
    });
  }

  stop() {
    this.#recognition?.stop();

    if (this.state === WAITING_FOR_MICROPHONE_ACCESS) {
      this.state = REJECTED;
      return;
    }

    this.state = RESOLVED;
  }

  #resetState() {
    this.#transcriptHistory = [];
    this.interimTranscript = "";
    this.finalTranscript = "";
    this.state = INITIAL;
  }

  #getTranscriptAsText(results: SpeechRecognitionResultList) {
    let transcriptArray: string[] = [];

    for (const result of Array.from(results)) {
      const { confidence, transcript } = result[0];
      // attempt to avoid duplicate phrases for android chrome
      if (isAndroid() && confidence === 0) {
        continue;
      }
      console.log({
        label: "getTranscriptAsText",
        isAndroid: isAndroid(),
        confidence,
        transcriptHistory: this.#transcriptHistory,
        transcriptArray: transcriptArray,
      });

      transcriptArray.push(transcript.trim());
    }

    if (isAndroid()) {
      transcriptArray = [...this.#transcriptHistory, ...transcriptArray];
    }

    return transcriptArray.join(" ");
  }

  #onStart() {
    this.state = LISTENING;
  }

  #onResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = this.#getTranscriptAsText(event.results);
    this.#lastResult = event.results;
  }

  #onEnd() {
    // restart for android chrome which can abruptly end early
    if (isAndroid() && this.state === LISTENING) {
      console.log({
        label: "onEnd",
        isAndroid: isAndroid(),
        transcriptHistory: this.#transcriptHistory,
        interimTranscript: this.interimTranscript,
      });

      if (this.interimTranscript) {
        this.#transcriptHistory = [this.interimTranscript];
      }

      this.#recognition?.stop();
      this.#recognition?.start();
      return;
    }

    if (this.state === RESOLVED && this.#lastResult) {
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

function isAndroid() {
  return /(android)/i.test(navigator.userAgent);
}

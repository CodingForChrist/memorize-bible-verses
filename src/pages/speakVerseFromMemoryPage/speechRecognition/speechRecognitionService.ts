export const SPEECH_RECOGNITION_STATE = {
  INITIAL: "INITIAL",
  WAITING_FOR_MICROPHONE_ACCESS: "WAITING_FOR_MICROPHONE_ACCESS",
  LISTENING: "LISTENING",
  AUDIOEND: "AUDIOEND",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;

export type SpeechRecognitionState =
  (typeof SPEECH_RECOGNITION_STATE)[keyof typeof SPEECH_RECOGNITION_STATE];

export const SPEECH_RECOGNITION_CUSTOM_EVENT = {
  UPDATE_STATE: "UPDATE_STATE",
  UPDATE_INTERIM_TRANSCRIPT: "UPDATE_INTERIM_TRANSCRIPT",
} as const;

export type SpeechRecognitionCustomEvent =
  (typeof SPEECH_RECOGNITION_CUSTOM_EVENT)[keyof typeof SPEECH_RECOGNITION_CUSTOM_EVENT];

const {
  INITIAL,
  WAITING_FOR_MICROPHONE_ACCESS,
  LISTENING,
  AUDIOEND,
  RESOLVED,
  REJECTED,
} = SPEECH_RECOGNITION_STATE;

export class SpeechRecognitionService extends EventTarget {
  finalTranscript?: string;
  #interimTranscript: string;
  #transcriptHistory: string[];
  #state: SpeechRecognitionState;
  recognition: SpeechRecognition;
  #lastResult?: SpeechRecognitionResultList;
  #allEvents?: {
    eventName: string;
    value?: unknown;
  }[];
  #resolveListener?: (value: string) => void;
  #rejectListener?: (reason: string) => void;

  constructor() {
    super();

    this.#state = INITIAL;
    this.#interimTranscript = "";
    this.#transcriptHistory = [];
    this.#allEvents = [];

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = this.#onStart.bind(this);
    this.recognition.onresult = this.#onResult.bind(this);
    this.recognition.onend = this.#onEnd.bind(this);
  }

  get state() {
    return this.#state;
  }

  set state(value: SpeechRecognitionState) {
    this.#state = value;

    const eventUpdateState = new CustomEvent<{
      state: SpeechRecognitionState;
    }>(SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_STATE, {
      detail: { state: value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateState);
  }

  get interimTranscript() {
    return this.#interimTranscript;
  }

  set interimTranscript(value: string) {
    this.#interimTranscript = value;

    const eventUpdateState = new CustomEvent<{ interimTranscript: string }>(
      SPEECH_RECOGNITION_CUSTOM_EVENT.UPDATE_INTERIM_TRANSCRIPT,
      {
        detail: { interimTranscript: value },
        bubbles: true,
        composed: true,
      },
    );
    this.dispatchEvent(eventUpdateState);
  }

  listen() {
    this.#resetState();

    return new Promise<string>((resolve, reject) => {
      // resolve or reject get invoked in the "end" event
      this.#resolveListener = resolve;
      this.#rejectListener = reject;

      this.state = WAITING_FOR_MICROPHONE_ACCESS;
      this.recognition.start();
    });
  }

  stop() {
    if (this.state === LISTENING) {
      this.state = AUDIOEND;
      this.recognition.stop();
    } else if (this.state === WAITING_FOR_MICROPHONE_ACCESS) {
      this.state = REJECTED;
      this.recognition.stop();
      if (this.#rejectListener) {
        this.#rejectListener("Failed to get microphone access");
      }
    }
  }

  #resetState() {
    this.#transcriptHistory = [];
    this.interimTranscript = "";
    this.finalTranscript = "";
    this.#lastResult = undefined;
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

      transcriptArray.push(transcript.trim());
    }

    if (isAndroid()) {
      if (
        this.state === AUDIOEND &&
        this.#transcriptHistory[0].endsWith(transcriptArray[0])
      ) {
        transcriptArray = [...this.#transcriptHistory];
      } else {
        transcriptArray = [...this.#transcriptHistory, ...transcriptArray];
      }
    }

    return transcriptArray.join(" ");
  }

  #onStart() {
    this.#allEvents?.push({
      eventName: "start",
    });
    this.state = LISTENING;
  }

  #onResult(event: SpeechRecognitionEvent) {
    this.#allEvents?.push({
      eventName: "result",
      value: Array.from(event.results).map((result) => {
        return Array.from(result).map(({ confidence, transcript }) => {
          return {
            confidence,
            transcript,
          };
        });
      }),
    });
    this.interimTranscript = this.#getTranscriptAsText(event.results);
    this.#lastResult = event.results;
  }

  #onEnd() {
    this.#allEvents?.push({
      eventName: "end",
    });

    // restart for android chrome which can abruptly end early
    if (isAndroid() && this.state === LISTENING) {
      if (this.interimTranscript) {
        this.#transcriptHistory = [this.interimTranscript];
      }

      this.recognition.stop();
      this.recognition.start();
      return;
    }

    if (this.state === AUDIOEND && this.#lastResult) {
      const transcript = this.#getTranscriptAsText(this.#lastResult);
      this.interimTranscript = transcript;
      this.finalTranscript = transcript;

      if (this.#resolveListener) {
        this.#resolveListener(this.finalTranscript);
      }
      this.state = RESOLVED;

      // console.log(this.getEventsReport());
      this.#allEvents = [];
    } else {
      if (this.#rejectListener) {
        this.#rejectListener("Failed to get final transcript");
      }
      this.state = REJECTED;
    }
  }

  getEventsReport() {
    const report = {
      userAgent: window.navigator.userAgent,
      events: this.#allEvents,
    };

    return JSON.stringify(report);
  }
}

function isAndroid() {
  return /(android)/i.test(navigator.userAgent);
}

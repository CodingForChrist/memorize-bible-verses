import { SpeechRecognitionError } from "./speech-recognition-error";

import { logger } from "../../../services/logger";

export const SPEECH_RECOGNITION_STATE = {
  INITIAL: "initial",
  WAITING_FOR_MICROPHONE_ACCESS: "waiting-for-microphone-access",
  LISTENING: "listening",
  AUDIOEND: "audioend",
  RESOLVED: "resolved",
  REJECTED: "rejected",
} as const;

export type SpeechRecognitionState =
  (typeof SPEECH_RECOGNITION_STATE)[keyof typeof SPEECH_RECOGNITION_STATE];

export const SPEECH_RECOGNITION_CUSTOM_EVENT = {
  UPDATE_STATE: "update-state",
  UPDATE_INTERIM_TRANSCRIPT: "update-interim-transcript",
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
  #interimTranscript: string;
  #transcriptHistory: string[];
  #state: SpeechRecognitionState;
  #lastResult?: SpeechRecognitionResultList;
  #allEvents: {
    eventName: string;
    value?: unknown;
  }[];
  #resolveListener?: (value: string) => void;
  #rejectListener?: (error: Error) => void;
  #recognitionAbortController?: AbortController;
  #visibilityAbortController?: AbortController;

  finalTranscript?: string;
  recognition?: SpeechRecognition;

  constructor() {
    super();

    this.#state = INITIAL;
    this.#interimTranscript = "";
    this.#transcriptHistory = [];
    this.#allEvents = [];

    this.#visibilityAbortController = new AbortController();
    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.hidden &&
          (this.state === LISTENING ||
            this.state === WAITING_FOR_MICROPHONE_ACCESS)
        ) {
          this.abort();
        }
      },
      { signal: this.#visibilityAbortController.signal },
    );
  }

  #createRecognitionInstance() {
    const SpeechRecognitionWithFallback =
      globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

    if (!SpeechRecognitionWithFallback) {
      throw new SpeechRecognitionError({
        code: "not-supported",
        message: "SpeechRecognition API is not supported in this browser.",
      });
    }

    const recognition = new SpeechRecognitionWithFallback();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    this.#recognitionAbortController = new AbortController();
    const { signal } = this.#recognitionAbortController;

    recognition.addEventListener("start", () => this.#onStart(), { signal });
    recognition.addEventListener(
      "result",
      (event) => this.#onResult(event as SpeechRecognitionEvent),
      { signal },
    );
    recognition.addEventListener(
      "error",
      (event) => this.#onError(event as SpeechRecognitionErrorEvent),
      { signal },
    );
    recognition.addEventListener("end", () => this.#onEnd(), { signal });

    return recognition;
  }

  #cleanupRecognition() {
    if (!this.recognition) {
      return;
    }

    this.#recognitionAbortController?.abort();
    this.#recognitionAbortController = undefined;

    try {
      this.recognition.abort();
    } catch {
      // Ignore if recognition has already ended
    }
    this.recognition = undefined;
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

    for (const result of results) {
      const { confidence, transcript } = result[0];
      // attempt to avoid duplicate phrases for android chrome
      if (confidence === 0 && isAndroid()) {
        continue;
      }

      transcriptArray.push(transcript.trim());
    }

    if (isAndroid()) {
      transcriptArray =
        this.state === AUDIOEND &&
        this.#transcriptHistory[0]?.endsWith(transcriptArray[0])
          ? [...this.#transcriptHistory]
          : [...this.#transcriptHistory, ...transcriptArray];
    }

    return transcriptArray.join(" ");
  }

  #onStart() {
    this.#allEvents.push({
      eventName: "start",
    });
    this.state = LISTENING;
  }

  #onResult(event: SpeechRecognitionEvent) {
    this.#allEvents.push({
      eventName: "result",
      value: [...event.results].map((result) => {
        return [...result].map(({ confidence, transcript }) => {
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

  #onError({ error: code, message }: SpeechRecognitionErrorEvent) {
    this.#allEvents.push({ eventName: "error", value: code });
    logger.error({
      message: "Speech recognition error",
      payload: { code, message },
    });
    this.state = REJECTED;
    this.#rejectListener?.(new SpeechRecognitionError({ code, message }));
    this.#cleanupRecognition();
  }

  #onEnd() {
    this.#allEvents.push({
      eventName: "end",
    });

    // restart for android chrome which can abruptly end early
    if (isAndroid() && this.state === LISTENING) {
      if (this.interimTranscript) {
        this.#transcriptHistory = [this.interimTranscript];
      }

      this.recognition?.stop();
      this.recognition?.start();
      return;
    }

    if (this.state === AUDIOEND && this.#lastResult) {
      try {
        const transcript = this.#getTranscriptAsText(this.#lastResult);
        this.interimTranscript = transcript;
        this.finalTranscript = transcript;

        this.state = RESOLVED;
        this.#resolveListener?.(this.finalTranscript);
      } catch (error) {
        logger.error({
          message: "Failed to get final transcript",
          payload: { errorMessage: error },
        });
        this.state = REJECTED;
        this.#rejectListener?.(
          error instanceof Error ? error : new Error(String(error)),
        );
      }
      // console.log(this.getEventsReport());
      this.#allEvents = [];
    } else {
      this.state = REJECTED;
      this.#rejectListener?.(
        new SpeechRecognitionError({
          code: "no-speech",
          message: "Failed to get final transcript",
        }),
      );
    }

    this.#cleanupRecognition();
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
      },
    );
    this.dispatchEvent(eventUpdateState);
  }

  listen() {
    this.#cleanupRecognition();
    this.#resetState();

    return new Promise<string>((resolve, reject) => {
      // resolve or reject get invoked in the "end" event
      this.#resolveListener = resolve;
      this.#rejectListener = reject;

      try {
        this.recognition = this.#createRecognitionInstance();
        this.state = WAITING_FOR_MICROPHONE_ACCESS;
        this.recognition.start();
      } catch (error) {
        this.state = REJECTED;
        throw error;
      }
    });
  }

  stop() {
    if (this.state === LISTENING) {
      this.state = AUDIOEND;
      this.recognition?.stop();
    } else if (this.state === WAITING_FOR_MICROPHONE_ACCESS) {
      this.abort();
    }
  }

  abort() {
    this.state = REJECTED;
    this.#rejectListener?.(
      new SpeechRecognitionError({
        code: "aborted",
        message: "Speech recognition aborted",
      }),
    );
    this.#cleanupRecognition();
  }

  destroy() {
    this.#cleanupRecognition();
    this.#visibilityAbortController?.abort();
    this.#visibilityAbortController = undefined;
  }

  getEventsReport() {
    const report = {
      userAgent: navigator.userAgent,
      events: this.#allEvents,
    };

    return JSON.stringify(report);
  }
}

function isAndroid() {
  return /(android)/i.test(navigator.userAgent);
}

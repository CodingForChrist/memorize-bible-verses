import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { SpeechRecognition as SpeechRecognitionMock } from "corti";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATE,
} from "./speech-recognition-service";

const {
  INITIAL,
  WAITING_FOR_MICROPHONE_ACCESS,
  LISTENING,
  RESOLVED,
  REJECTED,
} = SPEECH_RECOGNITION_STATE;

beforeAll(() => {
  vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

/**
Why `abort()` is called twice in `corti` once listening has started:
1. `corti` internally calls `abort()` inside `stop()`, AND triggers `"end"` synchronously
   on `abort()` (which invokes `#onEnd()` -> `#cleanupRecognition()` before `this.recognition`
   is cleared, or because `corti`'s `addEventListener` ignores `{ signal }`).
2. `#cleanupRecognition()` explicitly calls `recognition.abort()` to force iOS Safari to
   release the hardware audio session.
*/
const EXPECTED_CORTI_ABORT_CALLS = 2;
const ABORT_CALL_EXPLANATION =
  "Expected 2 abort() calls: 1 from corti's internal stop/end lifecycle + 1 explicit cleanup abort() for iOS Safari";

describe("SpeechRecognitionService", () => {
  let speechRecognitionService: SpeechRecognitionService;

  beforeEach(() => {
    speechRecognitionService = new SpeechRecognitionService();
  });

  afterEach(() => {
    speechRecognitionService.destroy();
    vi.restoreAllMocks();
  });

  describe("listen() and stop()", () => {
    let listenPromise: Promise<string>;
    let recognitionInstance: SpeechRecognitionMock;
    let say: SpeechRecognitionMock["say"];

    beforeEach(() => {
      listenPromise = speechRecognitionService.listen();
      recognitionInstance =
        speechRecognitionService.recognition as SpeechRecognitionMock;
      say = recognitionInstance.say.bind(recognitionInstance);
    });

    test("should successfully resolve the promise, return the transcript, and release recognition", async () => {
      const stopSpy = vi.spyOn(recognitionInstance, "stop");
      const abortSpy = vi.spyOn(recognitionInstance, "abort");

      expect(speechRecognitionService.state).toBe(LISTENING);
      say("Romans 3:23 for all have sinned");
      expect(speechRecognitionService.interimTranscript).toBe(
        "Romans 3:23 for all have sinned",
      );

      say(
        "Romans 3:23 for all have sinned and fall short of the glory of God Romans 3:23",
      );

      speechRecognitionService.stop();
      const finalTranscript = await listenPromise;

      expect(finalTranscript).toBe(
        "Romans 3:23 for all have sinned and fall short of the glory of God Romans 3:23",
      );
      expect(speechRecognitionService.state).toBe(RESOLVED);
      expect(stopSpy).toHaveBeenCalledTimes(1);
      expect(abortSpy, ABORT_CALL_EXPLANATION).toHaveBeenCalledTimes(
        EXPECTED_CORTI_ABORT_CALLS,
      );
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should reject the promise and release recognition if no results are received", async () => {
      const stopSpy = vi.spyOn(recognitionInstance, "stop");
      const abortSpy = vi.spyOn(recognitionInstance, "abort");

      expect(speechRecognitionService.state).toBe(LISTENING);
      speechRecognitionService.stop();

      await expect(listenPromise).rejects.toThrow(
        "Failed to get final transcript",
      );
      expect(speechRecognitionService.state).toBe(REJECTED);
      expect(stopSpy).toHaveBeenCalledTimes(1);
      expect(abortSpy, ABORT_CALL_EXPLANATION).toHaveBeenCalledTimes(
        EXPECTED_CORTI_ABORT_CALLS,
      );
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should create a fresh SpeechRecognition instance on subsequent listen() calls", async () => {
      const firstInstance = speechRecognitionService.recognition;
      say("Hello world");
      speechRecognitionService.stop();
      await listenPromise;

      const secondPromise = speechRecognitionService.listen();
      const secondInstance = speechRecognitionService.recognition;

      expect(secondInstance).toBeDefined();
      expect(secondInstance).not.toBe(firstInstance);

      speechRecognitionService.abort();
      await expect(secondPromise).rejects.toThrow("Speech recognition aborted");
    });
  });

  describe("microphone release and cancellation edge cases", () => {
    test("should immediately abort and reject when abort() is called while listening", async () => {
      const listenPromise = speechRecognitionService.listen();
      const recognitionInstance =
        speechRecognitionService.recognition as SpeechRecognitionMock;
      const abortSpy = vi.spyOn(recognitionInstance, "abort");

      speechRecognitionService.abort();

      await expect(listenPromise).rejects.toThrow("Speech recognition aborted");
      expect(speechRecognitionService.state).toBe(REJECTED);
      expect(abortSpy, ABORT_CALL_EXPLANATION).toHaveBeenCalledTimes(
        EXPECTED_CORTI_ABORT_CALLS,
      );
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should abort instead of stop when stop() is called while waiting for microphone access", async () => {
      // Prevent corti from synchronously transitioning to LISTENING
      vi.spyOn(SpeechRecognitionMock.prototype, "start").mockImplementation(
        () => {},
      );

      const listenPromise = speechRecognitionService.listen();
      const recognitionInstance =
        speechRecognitionService.recognition as SpeechRecognitionMock;
      const abortSpy = vi.spyOn(recognitionInstance, "abort");
      const stopSpy = vi.spyOn(recognitionInstance, "stop");

      expect(speechRecognitionService.state).toBe(
        WAITING_FOR_MICROPHONE_ACCESS,
      );

      speechRecognitionService.stop();

      await expect(listenPromise).rejects.toThrow("Speech recognition aborted");
      expect(speechRecognitionService.state).toBe(REJECTED);
      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(stopSpy).not.toHaveBeenCalled();
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should clean up and reject when a speech recognition error event occurs", async () => {
      const originalAddEventListener =
        SpeechRecognitionMock.prototype.addEventListener;
      let capturedErrorHandler:
        ((event: SpeechRecognitionErrorEvent) => void) | undefined;

      vi.spyOn(
        SpeechRecognitionMock.prototype,
        "addEventListener",
      ).mockImplementation(function (
        this: SpeechRecognitionMock,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) {
        if (type === "error" && typeof listener === "function") {
          capturedErrorHandler = listener as (
            event: SpeechRecognitionErrorEvent,
          ) => void;
        }
        return originalAddEventListener.call(this, type, listener, options);
      });

      const listenPromise = speechRecognitionService.listen();
      const recognitionInstance =
        speechRecognitionService.recognition as SpeechRecognitionMock;
      const abortSpy = vi.spyOn(recognitionInstance, "abort");

      const errorEvent = new Event("error") as SpeechRecognitionErrorEvent;
      Object.defineProperty(errorEvent, "error", { value: "no-speech" });

      capturedErrorHandler?.(errorEvent);

      await expect(listenPromise).rejects.toThrow(
        "Failed to get final transcript",
      );
      expect(speechRecognitionService.state).toBe(REJECTED);
      expect(abortSpy, ABORT_CALL_EXPLANATION).toHaveBeenCalledTimes(
        EXPECTED_CORTI_ABORT_CALLS,
      );
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should abort and release microphone when page becomes hidden (visibilitychange)", async () => {
      const listenPromise = speechRecognitionService.listen();
      const recognitionInstance =
        speechRecognitionService.recognition as SpeechRecognitionMock;
      const abortSpy = vi.spyOn(recognitionInstance, "abort");

      vi.spyOn(document, "hidden", "get").mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));

      await expect(listenPromise).rejects.toThrow("Speech recognition aborted");
      expect(speechRecognitionService.state).toBe(REJECTED);
      expect(abortSpy, ABORT_CALL_EXPLANATION).toHaveBeenCalledTimes(
        EXPECTED_CORTI_ABORT_CALLS,
      );
      expect(speechRecognitionService.recognition).toBeUndefined();
    });

    test("should stop listening to visibilitychange after destroy() is called", () => {
      const abortSpy = vi.spyOn(speechRecognitionService, "abort");
      speechRecognitionService.destroy();

      vi.spyOn(document, "hidden", "get").mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));

      expect(abortSpy).not.toHaveBeenCalled();
      expect(speechRecognitionService.state).toBe(INITIAL);
    });
  });
});

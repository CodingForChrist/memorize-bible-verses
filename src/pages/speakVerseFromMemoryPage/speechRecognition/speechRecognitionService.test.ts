import {
  describe,
  expect,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { SpeechRecognition as SpeechRecognitionMock } from "corti";

import {
  SpeechRecognitionService,
  SPEECH_RECOGNITION_STATE,
} from "./speechRecognitionService";

const { LISTENING, RESOLVED, REJECTED } = SPEECH_RECOGNITION_STATE;

beforeAll(() => {
  vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("listen()", () => {
  let speechRecognitionService: SpeechRecognitionService;
  let listenPromise: Promise<string>;
  let say: SpeechRecognitionMock["say"];

  beforeEach(() => {
    speechRecognitionService = new SpeechRecognitionService();

    listenPromise = speechRecognitionService.listen();
    say = (
      speechRecognitionService.recognition as SpeechRecognitionMock
    ).say.bind(speechRecognitionService.recognition);
  });

  test("should successfully resolve the promise and return the transcript", async () => {
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
  });

  test("should reject the promise if no results are received", async () => {
    expect(speechRecognitionService.state).toBe(LISTENING);
    speechRecognitionService.stop();
    await expect(async () => {
      await listenPromise;
    }).rejects.toThrowError("Failed to get final transcript");
    expect(speechRecognitionService.state).toBe(REJECTED);
  });
});

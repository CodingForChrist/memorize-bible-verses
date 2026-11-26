import {
  describe,
  expect,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";

import {
  SpeechRecognitionResultList,
  SpeechRecognitionResult,
  SpeechRecognitionEvent,
  SpeechRecognitionAlternative,
} from "corti";

import { SpeechRecognitionService } from "./speech-recognition-service";

import eventsFixtureChromeMacOS from "./test-fixtures/events-fixture-chrome-mac-os.json";
import eventsFixtureSafariMacOS from "./test-fixtures/events-fixture-safari-mac-os.json";
import eventsFixtureChromeAndroid from "./test-fixtures/events-fixture-chrome-android.json";
import eventsFixtureSafariIOS from "./test-fixtures/events-fixture-safari-ios.json";
import eventsFixtureChromeIOS from "./test-fixtures/events-fixture-chrome-ios.json";

beforeAll(() => {
  class SpeechRecognitionMock extends EventTarget {
    continuous = false;
    lang = "";
    interimResults = false;
    maxAlternatives = 1;

    start() {}
    stop() {}
    abort() {}
  }

  vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("speech recognition events", () => {
  type TestFixture = {
    browser: string;
    operatingSystem: string;
    userAgent: string;
    events: {
      eventName: string;
      value?: {
        transcript: string;
        confidence: number;
      }[][];
    }[];
  };
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      get: () => originalUserAgent,
      configurable: true,
    });
  });

  type TestCase = [
    label: string,
    expectedTranscript: string,
    testFixture: TestFixture,
  ];

  const testCases: TestCase[] = [
    [
      "Chrome on MacOS",
      "Romans 3:23 for all have sinned and fall short of the glory of God Romans 3:23",
      eventsFixtureChromeMacOS,
    ],
    [
      "Safari on MacOS",
      "Romans 323 for all have sinned and fall short of the glory of God Romans 323",
      eventsFixtureSafariMacOS,
    ],
    [
      "Chrome on Android",
      "Romans 3:23 all have sinned and fall short of the glory of God Romans 3:23",
      eventsFixtureChromeAndroid,
    ],
    [
      "Safari on iOS",
      "Romans 323 for all have sinned and fall short of the glory of God Romans 323",
      eventsFixtureSafariIOS,
    ],
    [
      "Chrome on iOS",
      "Romans 323 for all have sinned and fall short of the glory of God Romans 323",
      eventsFixtureChromeIOS,
    ],
  ];

  test.each(testCases)(
    "%s",
    async (_label, expectedTranscript, { userAgent, events }) => {
      Object.defineProperty(navigator, "userAgent", {
        get: () => userAgent,
        configurable: true,
      });

      const speechRecognitionService = new SpeechRecognitionService();
      const listenPromise = speechRecognitionService.listen();
      const { recognition } = speechRecognitionService;

      try {
        for (const [index, { eventName, value }] of events.entries()) {
          if (eventName === "start") {
            recognition?.dispatchEvent(new Event("start"));
            continue;
          }

          if (eventName === "end") {
            // call stop() when it's the last event in the array
            if (index === events.length - 1) {
              speechRecognitionService.stop();
            }
            recognition?.dispatchEvent(new Event("end"));
            continue;
          }

          if (eventName !== "result" || !value) {
            continue;
          }

          const speechRecognitionResults = value.map(
            (speechRecognitionAlternatives) => {
              return new SpeechRecognitionResult(
                speechRecognitionAlternatives.map(
                  ({ transcript, confidence }) => {
                    return new SpeechRecognitionAlternative(
                      transcript,
                      confidence,
                    );
                  },
                ),
              );
            },
          );

          const resultEvent = new SpeechRecognitionEvent("result", {
            results: new SpeechRecognitionResultList(speechRecognitionResults),
          });

          recognition?.dispatchEvent(resultEvent);
        }

        const finalTranscript = await listenPromise;
        expect(finalTranscript).toBe(expectedTranscript);
      } finally {
        speechRecognitionService.destroy();
      }
    },
  );
});

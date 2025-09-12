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

import { SpeechRecognitionService } from "./speechRecognitionService";

import eventsFixtureChromeMacOS from "./testFixtures/eventsFixtureChromeMacOS.json";
import eventsFixtureSafariMacOS from "./testFixtures/eventsFixtureSafariMacOS.json";
import eventsFixtureChromeAndroid from "./testFixtures/eventsFixtureChromeAndroid.json";
import eventsFixtureSafariIOS from "./testFixtures/eventsFixtureSafariIOS.json";
import eventsFixtureChromeIOS from "./testFixtures/eventsFixtureChromeIOS.json";

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

beforeAll(() => {
  class SpeechRecognitionMock {
    start() {}
    stop() {}
    onstart() {}
    onend() {}
    onresult() {}
  }

  vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("speech recognition events", () => {
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

      for (const [index, { eventName, value }] of events.entries()) {
        if (eventName === "start" && recognition.onstart) {
          recognition.onstart(new Event("start"));
          continue;
        }
        if (eventName === "end" && recognition.onend) {
          // call stop() when its the last event in the array
          if (index === events.length - 1) {
            speechRecognitionService.stop();
          }
          recognition.onend(new Event("end"));
          continue;
        }

        if (eventName === "result" && recognition.onresult && value) {
          const speechRecognitionResults = value.map(
            (SpeechRecognitionAlternatives) => {
              return new SpeechRecognitionResult(
                SpeechRecognitionAlternatives.map(
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

          recognition.onresult(resultEvent);
          continue;
        }
      }

      const finalTranscript = await listenPromise;
      expect(finalTranscript).toBe(expectedTranscript);
    },
  );
});

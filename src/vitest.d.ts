declare module "corti" {
  class SpeechRecognition extends globalThis.SpeechRecognition {
    say(value: string | string[]): void;
  }
  class SpeechRecognitionResultList
    extends globalThis.SpeechRecognitionResultList
  {
    constructor(results: SpeechRecognitionResult[]);
  }
  class SpeechRecognitionResult extends globalThis.SpeechRecognitionResult {
    constructor(alternatives: SpeechRecognitionAlternative[]);
  }
  class SpeechRecognitionAlternative
    extends globalThis.SpeechRecognitionAlternative
  {
    constructor(transcript: string, confidence: number);
  }

  export {
    SpeechRecognition,
    SpeechRecognitionEvent,
    SpeechRecognitionResultList,
    SpeechRecognitionResult,
    SpeechRecognitionAlternative,
  };
}

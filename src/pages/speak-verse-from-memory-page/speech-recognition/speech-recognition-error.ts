type SpeechRecognitionErrorOptions = {
  code: SpeechRecognitionErrorCode | "not-supported";
  message?: string;
};

export class SpeechRecognitionError extends Error {
  public readonly code: SpeechRecognitionErrorOptions["code"];

  constructor({ code, message }: SpeechRecognitionErrorOptions) {
    super(message || `Speech recognition failed with error: ${code}`);
    this.name = "SpeechRecognitionError";
    this.code = code;
  }
}

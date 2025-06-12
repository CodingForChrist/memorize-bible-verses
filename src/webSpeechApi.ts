export function createSpeechRecognitionInstance() {
  if (!hasSupportForSpeechRecognition()) {
    throw new Error("Unsupported browser");
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.lang = "en-US";
  speechRecognition.interimResults = false;
  speechRecognition.maxAlternatives = 1;

  return speechRecognition;
}

function hasSupportForSpeechRecognition() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

export function formatTranscriptToString(
  speechRecognitionEventResults: SpeechRecognitionResultList,
) {
  const transcriptArray = [];

  for (const result of speechRecognitionEventResults) {
    transcriptArray.push(result[0].transcript);
  }

  return transcriptArray.join(" ");
}

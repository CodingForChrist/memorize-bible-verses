type ImproveSpeechRecognitionInputOptions = {
  transcript: string;
  verseReference: string;
  verseText: string;
};

export function improveSpeechRecognitionInput({
  transcript,
  verseReference,
  verseText,
}: ImproveSpeechRecognitionInputOptions) {
  let improvedTranscript = addMissingColonsToBibleReference({
    transcript,
    verseReference,
    verseText,
  });

  improvedTranscript = replaceSpelledOutNumbersInBibleReference({
    transcript: improvedTranscript,
    verseReference,
    verseText,
  });

  return improvedTranscript;
}

function addMissingColonsToBibleReference({
  transcript,
  verseReference,
}: ImproveSpeechRecognitionInputOptions) {
  let improvedTranscript = transcript;
  const verseReferenceWithoutColon = verseReference.replace(":", "");
  if (transcript.includes(verseReferenceWithoutColon)) {
    improvedTranscript = improvedTranscript.replaceAll(
      verseReferenceWithoutColon,
      verseReference,
    );
  }
  return improvedTranscript;
}

function replaceSpelledOutNumbersInBibleReference({
  transcript,
  verseReference,
}: ImproveSpeechRecognitionInputOptions) {
  // safari spells out numbers less than ten
  const numberMap: Record<string, string> = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
  };
  const digits = verseReference.match(/\d+/g);
  const book = verseReference.match(/[a-zA-Z]+/);
  if (!book || !digits) {
    return transcript;
  }

  const numbersSpelledOut = digits.map((digit) => {
    return numberMap[digit] ?? digit;
  });

  const verseReferenceWithNumbersSpelledOut = `${book} ${numbersSpelledOut.join(" ")}`;
  let improvedTranscript = transcript;

  if (transcript.includes(verseReferenceWithNumbersSpelledOut)) {
    improvedTranscript = improvedTranscript.replaceAll(
      verseReferenceWithNumbersSpelledOut,
      verseReference,
    );
  }
  return improvedTranscript;
}

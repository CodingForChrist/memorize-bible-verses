import { VerseReferenceSchema } from "../../schemas/verse-reference-schema";
import { logger } from "../../services/logger";

type AutoCorrectSpeechRecognitionInputOptions = {
  transcript: string;
  verseReference: string;
  verseText: string;
};

export function autoCorrectSpeechRecognitionInput({
  transcript,
  verseReference,
  verseText,
}: AutoCorrectSpeechRecognitionInputOptions) {
  let improvedTranscript = replaceSpelledOutNumbersInBibleReference({
    transcript,
    verseReference,
    verseText,
  });

  improvedTranscript = addMissingColonsToBibleReference({
    transcript: improvedTranscript,
    verseReference,
    verseText,
  });

  improvedTranscript = useDashForVerseRanges({
    transcript: improvedTranscript,
    verseReference,
    verseText,
  });

  logger.debug({
    message: "autoCorrectSpeechRecognitionInput()",
    payload: {
      verseReference,
      originalTranscript: transcript,
      improvedTranscript,
    },
  });

  return improvedTranscript;
}

function addMissingColonsToBibleReference({
  transcript,
  verseReference,
}: AutoCorrectSpeechRecognitionInputOptions) {
  let singleVerseReference = verseReference;
  if (verseReference.includes("-")) {
    // remove the verse range and just use the first verse
    singleVerseReference = verseReference.split("-")[0];
  }

  let improvedTranscript = transcript;
  const singleVerseReferenceWithoutColon = singleVerseReference.replace(
    ":",
    "",
  );

  const searchPatternSingleVerseReferenceWithoutColon = new RegExp(
    singleVerseReferenceWithoutColon,
    "gi",
  );

  if (searchPatternSingleVerseReferenceWithoutColon.test(improvedTranscript)) {
    improvedTranscript = improvedTranscript.replaceAll(
      searchPatternSingleVerseReferenceWithoutColon,
      singleVerseReference,
    );
  }

  const singleVerseReferenceWithoutColonWithSpace =
    singleVerseReference.replace(":", " ");

  const searchPatternSingleVerseReferenceWithoutColonWithSpace = new RegExp(
    singleVerseReferenceWithoutColonWithSpace,
    "gi",
  );

  if (
    searchPatternSingleVerseReferenceWithoutColonWithSpace.test(
      improvedTranscript,
    )
  ) {
    improvedTranscript = improvedTranscript.replaceAll(
      searchPatternSingleVerseReferenceWithoutColonWithSpace,
      singleVerseReference,
    );
  }

  return improvedTranscript;
}

function replaceSpelledOutNumbersInBibleReference({
  transcript,
  verseReference,
}: AutoCorrectSpeechRecognitionInputOptions) {
  // safari spells out numbers less than ten
  const spelledOutNumbersMap: Record<string, string> = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  };

  // handle books like 1st and 2nd Corinthians
  const ordinalNumbersMap: Record<string, string[]> = {
    1: ["1st", "First", "first"],
    2: ["2nd", "Second", "second"],
    3: ["3rd", "Third", "third"],
  };

  const { success, data } = VerseReferenceSchema.safeParse(verseReference);

  if (!success) {
    return transcript;
  }

  const { bookNumber, bookName, chapter, verseNumberStart, verseNumberEnd } =
    data;

  let improvedTranscript = transcript;

  if (bookNumber && ordinalNumbersMap[bookNumber]) {
    const bookNumberAsOrdinalNumbers = ordinalNumbersMap[bookNumber];

    for (const bookNumberAsOrdinalNumber of bookNumberAsOrdinalNumbers) {
      if (
        improvedTranscript.includes(`${bookNumberAsOrdinalNumber} ${bookName}`)
      ) {
        improvedTranscript = improvedTranscript.replaceAll(
          `${bookNumberAsOrdinalNumber} ${bookName}`,
          `${bookNumber} ${bookName}`,
        );
      }
    }
  }

  if (spelledOutNumbersMap[chapter]) {
    const chapterSpelledOut = spelledOutNumbersMap[chapter];

    const searchPattern = new RegExp(`${bookName} ${chapterSpelledOut}`, "gi");
    if (searchPattern.test(improvedTranscript)) {
      improvedTranscript = improvedTranscript.replaceAll(
        searchPattern,
        `${bookName} ${chapter}`,
      );
    }
  }

  if (spelledOutNumbersMap[verseNumberStart]) {
    const verseNumberStartSpelledOut = spelledOutNumbersMap[verseNumberStart];

    const searchPattern = new RegExp(
      `${bookName} ${chapter}[ : ]?${verseNumberStartSpelledOut}`,
      "gi",
    );

    if (searchPattern.test(improvedTranscript)) {
      improvedTranscript = improvedTranscript.replaceAll(
        searchPattern,
        `${bookName} ${chapter}:${verseNumberStart}`,
      );
    }
  }

  if (spelledOutNumbersMap[verseNumberEnd]) {
    const verseNumberEndSpelledOut = spelledOutNumbersMap[verseNumberEnd];

    const searchPattern = new RegExp(
      `${bookName} ${chapter}[ : ]?${verseNumberStart} [-a-z]+ ${verseNumberEndSpelledOut}`,
      "gi",
    );

    if (searchPattern.test(improvedTranscript)) {
      improvedTranscript = improvedTranscript.replaceAll(
        searchPattern,
        `${bookName} ${chapter}:${verseNumberStart}-${verseNumberEnd}`,
      );
    }
  }

  return improvedTranscript;
}

function useDashForVerseRanges({
  transcript,
  verseReference,
}: AutoCorrectSpeechRecognitionInputOptions) {
  if (!verseReference.includes("-")) {
    return transcript;
  }

  const rangeDividers = [" to ", " through ", "2"];
  const singleVerseReference = verseReference.split("-")[0];

  const { success, data } = VerseReferenceSchema.safeParse(verseReference);

  if (!success) {
    return transcript;
  }

  const { verseNumberEnd } = data;

  let improvedTranscript = transcript;

  for (const rangeDivider of rangeDividers) {
    const verseReferenceWithDividerWord = `${singleVerseReference}${rangeDivider}${verseNumberEnd}`;
    if (improvedTranscript.includes(verseReferenceWithDividerWord)) {
      improvedTranscript = improvedTranscript.replaceAll(
        verseReferenceWithDividerWord,
        verseReference,
      );
    }
  }

  return improvedTranscript;
}

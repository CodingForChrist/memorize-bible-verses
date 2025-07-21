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

  return improvedTranscript;
}

function addMissingColonsToBibleReference({
  transcript,
  verseReference,
}: ImproveSpeechRecognitionInputOptions) {
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
  if (improvedTranscript.includes(singleVerseReferenceWithoutColon)) {
    improvedTranscript = improvedTranscript.replaceAll(
      singleVerseReferenceWithoutColon,
      singleVerseReference,
    );
  }

  const singleVerseReferenceWithoutColonWithSpace =
    singleVerseReference.replace(":", " ");
  if (improvedTranscript.includes(singleVerseReferenceWithoutColonWithSpace)) {
    improvedTranscript = improvedTranscript.replaceAll(
      singleVerseReferenceWithoutColonWithSpace,
      singleVerseReference,
    );
  }

  return improvedTranscript;
}

function replaceSpelledOutNumbersInBibleReference({
  transcript,
  verseReference,
}: ImproveSpeechRecognitionInputOptions) {
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

  const { bookNumber, bookName, chapter, verseNumberStart } =
    parseVerseReferenceIntoParts(verseReference);

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
    if (improvedTranscript.includes(`${bookName} ${chapterSpelledOut}`)) {
      improvedTranscript = improvedTranscript.replaceAll(
        `${bookName} ${chapterSpelledOut}`,
        `${bookName} ${chapter}`,
      );
    }
  }

  if (spelledOutNumbersMap[verseNumberStart]) {
    const verseNumberStartSpelledOut = spelledOutNumbersMap[verseNumberStart];
    if (
      improvedTranscript.includes(
        `${bookName} ${chapter} ${verseNumberStartSpelledOut}`,
      )
    ) {
      improvedTranscript = improvedTranscript.replaceAll(
        `${bookName} ${chapter} ${verseNumberStartSpelledOut}`,
        `${bookName} ${chapter}:${verseNumberStart}`,
      );
    }
  }

  return improvedTranscript;
}

function useDashForVerseRanges({
  transcript,
  verseReference,
}: ImproveSpeechRecognitionInputOptions) {
  if (!verseReference.includes("-")) {
    return transcript;
  }

  const rangeDividers = [" to ", " through ", "2"];
  const singleVerseReference = verseReference.split("-")[0];
  const { verseNumberEnd } = parseVerseReferenceIntoParts(verseReference);
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

export function parseVerseReferenceIntoParts(verseReference: string) {
  let bookNumber;
  let verseReferenceWithoutBookNumber = verseReference;

  if (Object.keys(["1", "2", "3"]).includes(verseReference.charAt(0))) {
    verseReferenceWithoutBookNumber = verseReference
      .split(verseReference.charAt(0))[1]
      .trim();
    bookNumber = Number(verseReference.charAt(0));
  }

  const bookNameRegExpMatchArray =
    verseReferenceWithoutBookNumber.match(/[a-zA-Z]+/);
  if (!bookNameRegExpMatchArray) {
    throw new Error("Failed to parse book name out of verse reference");
  }

  const bookName = bookNameRegExpMatchArray[0];
  const chapterAndVerses = verseReferenceWithoutBookNumber
    .split(bookName)[1]
    .trim();
  const [chapter, verseResult] = chapterAndVerses.split(":");

  const [verseNumberStart, verseNumberEnd] = verseResult.includes("-")
    ? verseResult.split("-")
    : [verseResult, verseResult];

  return {
    bookName,
    bookNumber,
    chapter: Number(chapter),
    verseNumberStart: Number(verseNumberStart),
    verseNumberEnd: Number(verseNumberEnd),
  };
}

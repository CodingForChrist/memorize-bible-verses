import { diffWords } from "diff";

type GetTextDifferenceForBibleVerseOptions = {
  originalBibleVerseText: string;
  recitedBibleVerseText: string;
};

export function getTextDifferenceForBibleVerse({
  originalBibleVerseText,
  recitedBibleVerseText,
}: GetTextDifferenceForBibleVerseOptions) {
  const difference = diffWords(recitedBibleVerseText, originalBibleVerseText, {
    ignoreCase: true,
  });

  const colorGreen = "#aceebb";
  const colorRed = "#ffcecb";

  const divElement = document.createElement("div");
  let wordCount = 0;
  let errorCount = 0;

  for (const [index, part] of difference.entries()) {
    // green for additions, red for deletions
    let color = "transparent";
    const textWithoutPunctuation = removePunctuationFromText(part.value.trim());
    const partCount = textWithoutPunctuation.split(" ").length;

    if (textWithoutPunctuation === "") {
      continue;
    }

    if (part.added) {
      color = colorGreen;
      errorCount += partCount;
    }

    if (part.removed) {
      color = colorRed;
      errorCount += partCount;
    }

    // do not count words that are not in the actual verse
    if (part.removed === false) {
      wordCount += partCount;
    }

    const span = document.createElement("span");
    span.style.backgroundColor = color;

    const isLastPart = index === difference.length - 1;
    const textToAppend = isLastPart
      ? textWithoutPunctuation
      : textWithoutPunctuation + " ";
    span.appendChild(document.createTextNode(textToAppend));
    divElement.appendChild(span);
  }

  return {
    textDifferenceDivContainer: divElement,
    errorCount: errorCount,
    wordCount,
  };
}

function removePunctuationFromText(text: string) {
  const punctuationCharacters = [".", ";", ",", "!", "¶", "“"];
  const hasLettersOrNumbersRegex = /[a-zA-Z0-9]/;

  // return empty string when text is only punctuation
  if (hasLettersOrNumbersRegex.test(text) === false) {
    return "";
  }

  let updatedText = text;
  for (const punctuationCharacter of punctuationCharacters) {
    if (updatedText.includes(punctuationCharacter)) {
      updatedText = updatedText.replaceAll(punctuationCharacter, "");
    }
  }
  return updatedText;
}

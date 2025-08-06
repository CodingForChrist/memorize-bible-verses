import { diffWords } from "diff";

type GetTextDifferenceForBibleVerseOptions = {
  originalBibleVerseText: string;
  recitedBibleVerseText: string;
};

const punctuationCharacters = [".", ";", ",", "!", "¶", "“"];

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

  for (const part of difference) {
    // green for additions, red for deletions
    let color = "transparent";

    const isPunctuation = punctuationCharacters.includes(part.value.trim());

    if (part.added && !isPunctuation) {
      color = colorGreen;
      errorCount += getWordCountWithoutPunctuation(part.value);
    }

    if (part.removed) {
      color = colorRed;
      errorCount += getWordCountWithoutPunctuation(part.value);
    }

    wordCount += part.count;

    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.appendChild(document.createTextNode(part.value));
    divElement.appendChild(span);
  }

  return {
    textDifferenceDivContainer: divElement,
    errorCount: errorCount,
    wordCount,
  };
}

function getWordCountWithoutPunctuation(partValue: string) {
  let updatedPartValue = partValue.trim();
  for (const punctuationCharacter of punctuationCharacters) {
    if (updatedPartValue.includes(punctuationCharacter)) {
      updatedPartValue.replaceAll(punctuationCharacter, "");
    }
  }
  return updatedPartValue.split(" ").length;
}

import type {
  BibleVerse,
  BibleVerseContentItem,
} from "../schemas/bible-verse-schema";

export function standardizeVerseReference(verseReference: string) {
  let updatedVerseReference = verseReference.trim();

  // the singular version "Psalm" is used for displaying references (ex: Psalm 23)
  // but the data structure for a verse reference always uses "Psalms"
  // this code handles that difference to make sure they match
  if (updatedVerseReference.startsWith("Psalms")) {
    updatedVerseReference = verseReference.replace("Psalms", "Psalm");
  }

  // the New King James Version (NKJV) uses roman numerals for book numbers
  // replace roman numbers with numbers
  const romanNumeralMap = {
    I: "1",
    II: "2",
    III: "3",
  };

  for (const [key, value] of Object.entries(romanNumeralMap)) {
    if (updatedVerseReference.startsWith(`${key} `)) {
      updatedVerseReference = verseReference.replace(`${key} `, `${value} `);
    }
  }

  return updatedVerseReference;
}

export function convertBibleVerseContentToText(content: BibleVerse["content"]) {
  let textParts: string[] = [];

  for (const topLevelItem of content) {
    if (topLevelItem.type === "tag" && Array.isArray(topLevelItem.items)) {
      textParts = [
        ...textParts,
        ...getTextFromBibleVerseContentItemsArray(topLevelItem.items),
      ];
    }
  }

  return textParts.join(" ").trim();
}

function getTextFromBibleVerseContentItemsArray(
  items: BibleVerseContentItem[],
): string[] {
  let textArray: string[] = [];
  for (const item of items) {
    if (item.type === "tag" && item.name === "verse") {
      // ignore verse numbers
      continue;
    }

    if (item.type === "tag" && Array.isArray(item.items)) {
      textArray = [
        ...textArray,
        ...getTextFromBibleVerseContentItemsArray(item.items),
      ];
    }

    if (item.type === "text" && item.text) {
      // ignore spaces
      if (item.text.trim() === "") {
        continue;
      }

      // ignore heading text not related to a verse
      if (!item.attrs?.verseId) {
        continue;
      }

      textArray.push(item.text.trim());
    }
  }

  return textArray;
}

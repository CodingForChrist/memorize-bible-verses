import { findBibleBookByAbbreviation } from "../data/bible-book-model";

import type {
  BibleVerse,
  BibleVerseContentItem,
} from "../schemas/bible-verse-schema";

export function standardizeVerseReference(verseReference: string) {
  let updatedVerseReference = verseReference.trim();

  // use singular version "Psalm" when displaying references (ex: Psalm 23)
  // Psalms 23 => Psalm 23
  if (updatedVerseReference.startsWith("Psalms")) {
    updatedVerseReference = verseReference.replace("Psalms", "Psalm");
  }

  // the New King James Version (NKJV) uses roman numerals for book numbers
  // replace roman numbers with numbers
  // III John 1:11 => 3 John 1:11
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

  // replace the abbreviated book name for translations
  // like the New International Version (NIV)
  // Matt. 28:18 => Matthew 28:18
  if (updatedVerseReference.includes(".")) {
    const [bookAbbreviation, ...rest] = updatedVerseReference.split(/\./);
    const fullBookName = findBibleBookByAbbreviation(bookAbbreviation);
    updatedVerseReference = [fullBookName, ...rest].join("");
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

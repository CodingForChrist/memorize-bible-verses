import { parseVerseReferenceIntoParts } from "../../services/parse-bible-verse-reference";
import {
  oldTestamentBooks,
  newTestamentBooks,
} from "../../data/bible-books.json";

export function getOldTestamentVerseReferences(verseReferences: string[]) {
  const oldTestamentVerses = verseReferences.filter((verseReferences) => {
    let { fullBookName } = parseVerseReferenceIntoParts(verseReferences);
    if (fullBookName === "Psalm") {
      fullBookName = "Psalms";
    }

    return oldTestamentBooks.includes(fullBookName);
  });
  return oldTestamentVerses;
}

export function getNewTestamentVerseReferences(verseReferences: string[]) {
  const newTestamentVerses = verseReferences.filter((verseReferences) => {
    const { fullBookName } = parseVerseReferenceIntoParts(verseReferences);

    return newTestamentBooks.includes(fullBookName);
  });
  return newTestamentVerses;
}

export function sortBibleVerseReferences(verseReferences: string[]) {
  const verseReferencesWithMetadata = verseReferences.map((verseReference) => {
    return parseVerseReferenceIntoParts(verseReference);
  });

  const sortedVerseReferencesWithMetadata = verseReferencesWithMetadata.sort(
    (a, b) => {
      const updatedOldTestament = oldTestamentBooks.map((bookName) => {
        if (bookName === "Psalms") {
          return "Psalm";
        }
        return bookName;
      });

      const allBooks = [...updatedOldTestament, ...newTestamentBooks];

      const aBookIndex = allBooks.indexOf(a.fullBookName);
      const bBookIndex = allBooks.indexOf(b.fullBookName);

      // 1. sort by book
      if (aBookIndex < bBookIndex) {
        return -1;
      } else if (aBookIndex > bBookIndex) {
        return 1;
      }

      // 2. sort by chapter
      if (a.chapter < b.chapter) {
        return -1;
      } else if (a.chapter > b.chapter) {
        return 1;
      }

      // 3. sort by verse
      if (a.verseNumberStart < b.verseNumberStart) {
        return -1;
      } else if (a.verseNumberStart > b.verseNumberStart) {
        return 1;
      }

      return 0;
    },
  );

  return sortedVerseReferencesWithMetadata.map(
    ({
      fullBookName,
      chapter,
      verseNumberStart,
      verseNumberEnd,
      verseCount,
    }) => {
      return `${fullBookName} ${chapter}:${verseNumberStart}${verseCount > 1 ? `-${verseNumberEnd}` : ""}`;
    },
  );
}

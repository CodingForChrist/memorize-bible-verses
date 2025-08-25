const oldTestamentBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
];

const newTestamentBooks = [
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

export function getBookFromVerseReference(verseReference: string) {
  const [book] = verseReference.split(/(?<=[A-Za-z])\s/);
  return book;
}

export function parseVerseReferenceIntoParts(verseReference: string) {
  let bookNumber;
  let verseReferenceWithoutBookNumber = verseReference;

  if (Object.keys(["1", "2", "3"]).includes(verseReference.charAt(0))) {
    verseReferenceWithoutBookNumber = verseReference.substring(1).trim();
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

  const verseCount = 1 + Number(verseNumberEnd) - Number(verseNumberStart);

  return {
    fullBookName: bookNumber ? `${bookNumber} ${bookName}` : bookName,
    bookName,
    bookNumber,
    chapter: Number(chapter),
    verseNumberStart: Number(verseNumberStart),
    verseNumberEnd: Number(verseNumberEnd),
    verseCount,
  };
}

export function getOldTestamentVerseReferences(verseReferences: string[]) {
  const oldTestamentVerses = verseReferences.filter((verseReferences) => {
    let bookName = getBookFromVerseReference(verseReferences);
    if (bookName === "Psalm") {
      bookName = "Psalms";
    }

    return oldTestamentBooks.includes(bookName);
  });
  return oldTestamentVerses;
}

export function getNewTestamentVerseReferences(verseReferences: string[]) {
  const newTestamentVerses = verseReferences.filter((verseReferences) => {
    return newTestamentBooks.includes(
      getBookFromVerseReference(verseReferences),
    );
  });
  return newTestamentVerses;
}

export function sortBibleVerseReferences(verseReferences: string[]) {
  const verseReferencesWithMetadata = verseReferences.map((verseReference) => {
    return parseVerseReferenceIntoParts(verseReference);
  });

  const sortedVerseReferencesWithMetadata = verseReferencesWithMetadata.sort(
    (a, b) => {
      const updatedOldTestamentBooks = oldTestamentBooks.map((bookName) => {
        if (bookName === "Psalms") {
          return "Psalm";
        }
        return bookName;
      });

      const allBooks = [...updatedOldTestamentBooks, ...newTestamentBooks];

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

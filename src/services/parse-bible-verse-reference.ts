export function parseVerseReferenceIntoParts(verseReference: string) {
  let bookNumber;
  let verseReferenceWithoutBookNumber = verseReference;

  if (Object.keys(["1", "2", "3"]).includes(verseReference.charAt(0))) {
    verseReferenceWithoutBookNumber = verseReference.slice(1).trim();
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

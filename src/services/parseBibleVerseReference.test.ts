import { describe, expect, test } from "vitest";

import { parseVerseReferenceIntoParts } from "./parseBibleVerseReference";

describe("parseVerseReferenceIntoParts()", () => {
  test("parses a single verse", () => {
    expect(parseVerseReferenceIntoParts("John 3:16")).toEqual({
      fullBookName: "John",
      bookName: "John",
      bookNumber: undefined,
      chapter: 3,
      verseNumberStart: 16,
      verseNumberEnd: 16,
      verseCount: 1,
    });

    expect(parseVerseReferenceIntoParts("2 Corinthians 5:17")).toEqual({
      fullBookName: "2 Corinthians",
      bookName: "Corinthians",
      bookNumber: 2,
      chapter: 5,
      verseNumberStart: 17,
      verseNumberEnd: 17,
      verseCount: 1,
    });
  });

  test("parses a verse range", () => {
    expect(parseVerseReferenceIntoParts("John 1:1-10")).toEqual({
      fullBookName: "John",
      bookName: "John",
      bookNumber: undefined,
      chapter: 1,
      verseNumberStart: 1,
      verseNumberEnd: 10,
      verseCount: 10,
    });

    expect(parseVerseReferenceIntoParts("2 Corinthians 5:2-17")).toEqual({
      fullBookName: "2 Corinthians",
      bookName: "Corinthians",
      bookNumber: 2,
      chapter: 5,
      verseNumberStart: 2,
      verseNumberEnd: 17,
      verseCount: 16,
    });
  });
});

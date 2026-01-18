import { describe, expect, test } from "vitest";
import { ZodError } from "zod";

import { VerseReferenceSchema } from "./verse-reference-schema";

describe("VerseReferenceSchema", () => {
  test("should successfully parse a single verse", () => {
    expect(VerseReferenceSchema.parse("John 3:16")).toEqual({
      fullBookName: "John",
      bookName: "John",
      bookNumber: undefined,
      chapter: 3,
      verseNumberStart: 16,
      verseNumberEnd: 16,
      verseCount: 1,
    });

    expect(VerseReferenceSchema.parse("2 Corinthians 5:17")).toEqual({
      fullBookName: "2 Corinthians",
      bookName: "Corinthians",
      bookNumber: 2,
      chapter: 5,
      verseNumberStart: 17,
      verseNumberEnd: 17,
      verseCount: 1,
    });
  });

  test("should successfully parse a verse range", () => {
    expect(VerseReferenceSchema.parse("Song of Solomon 2:1-3")).toEqual({
      fullBookName: "Song of Solomon",
      bookName: "Song of Solomon",
      bookNumber: undefined,
      chapter: 2,
      verseNumberStart: 1,
      verseNumberEnd: 3,
      verseCount: 3,
    });

    expect(VerseReferenceSchema.parse("Revelation 19:13-16")).toEqual({
      fullBookName: "Revelation",
      bookName: "Revelation",
      bookNumber: undefined,
      chapter: 19,
      verseNumberStart: 13,
      verseNumberEnd: 16,
      verseCount: 4,
    });
  });

  test("should throw a validation error", () => {
    expect(() => {
      // missing space after book name
      VerseReferenceSchema.parse("John3:16");
    }).toThrowError(ZodError);

    expect(() => {
      // invalid book name
      VerseReferenceSchema.parse("invalidBook3:16");
    }).toThrowError(ZodError);
  });
});

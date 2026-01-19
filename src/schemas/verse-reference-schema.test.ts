import { describe, expect, test } from "vitest";

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

  test("should successfully parse verses regardless of case", () => {
    expect(VerseReferenceSchema.parse("GALATIANS 5:22-23")).toEqual({
      fullBookName: "Galatians",
      bookName: "Galatians",
      bookNumber: undefined,
      chapter: 5,
      verseNumberStart: 22,
      verseNumberEnd: 23,
      verseCount: 2,
    });

    expect(VerseReferenceSchema.parse("revelation 4:11")).toEqual({
      fullBookName: "Revelation",
      bookName: "Revelation",
      bookNumber: undefined,
      chapter: 4,
      verseNumberStart: 11,
      verseNumberEnd: 11,
      verseCount: 1,
    });
  });

  test("should throw a validation error for missing space", () => {
    const { success, error } = VerseReferenceSchema.safeParse("John3:16");
    expect(success).toBeFalsy();
    if (!success) {
      expect(error.issues).toHaveLength(1);
      expect(error.issues[0].message).toContain(
        "Must include a single space to separate the book name from the chapter",
      );
    }
  });

  test("should throw a validation error for a missing colon", () => {
    const { success, error } = VerseReferenceSchema.safeParse("John 316");
    expect(success).toBeFalsy();
    if (!success) {
      expect(error.issues).toHaveLength(1);
      expect(error.issues[0].message).toContain(
        "Must include a single colon character to separate the chapter from the verse",
      );
    }
  });

  test("should throw a validation error for an invalid book name", () => {
    const { success, error } = VerseReferenceSchema.safeParse(
      "invalidBookName 3:16",
    );
    expect(success).toBeFalsy();
    if (!success) {
      expect(error.issues).toHaveLength(1);
      expect(error.issues[0].message).toContain("Invalid book name");
    }
  });
});

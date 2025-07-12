import { describe, expect, test } from "vitest";

import {
  improveSpeechRecognitionInput,
  parseVerseReferenceIntoParts,
} from "./improveSpeechRecognitionInput";

describe("improveSpeechRecognitionInput()", () => {
  test("should add missing colon between chapter and verse number", () => {
    const transcript =
      "Genesis 11 In the beginning God created the heavens and the earth Genesis 11";
    const expectedOutput =
      "Genesis 1:1 In the beginning God created the heavens and the earth Genesis 1:1";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "Genesis 1:1",
        verseText: expectedOutput,
      }),
    ).toBe(expectedOutput);
  });

  test("should convert spelled out numbers to actual numbers", () => {
    const transcript =
      "Genesis one one In the beginning God created the heavens and the earth Genesis one one";
    const expectedOutput =
      "Genesis 1:1 In the beginning God created the heavens and the earth Genesis 1:1";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "Genesis 1:1",
        verseText: expectedOutput,
      }),
    ).toBe(expectedOutput);
  });

  test("should convert ordinal numbers for books of the bible", () => {
    const transcript =
      "Second Corinthians 57 For we walk by faith not by sight second Corinthians 57";
    const expectedOutput =
      "2 Corinthians 5:7 For we walk by faith not by sight 2 Corinthians 5:7";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "2 Corinthians 5:7",
        verseText: expectedOutput,
      }),
    ).toBe(expectedOutput);
  });
});

describe("parseVerseReferenceIntoParts()", () => {
  test("parses a single verse", () => {
    expect(parseVerseReferenceIntoParts("John 3:16")).toEqual({
      bookName: "John",
      bookNumber: undefined,
      chapter: 3,
      verseNumberStart: 16,
      verseNumberEnd: 16,
    });

    expect(parseVerseReferenceIntoParts("2 Corinthians 5:17")).toEqual({
      bookName: "Corinthians",
      bookNumber: 2,
      chapter: 5,
      verseNumberStart: 17,
      verseNumberEnd: 17,
    });
  });

  test("parses a verse range", () => {
    expect(parseVerseReferenceIntoParts("John 1:1-10")).toEqual({
      bookName: "John",
      bookNumber: undefined,
      chapter: 1,
      verseNumberStart: 1,
      verseNumberEnd: 10,
    });

    expect(parseVerseReferenceIntoParts("2 Corinthians 5:1-17")).toEqual({
      bookName: "Corinthians",
      bookNumber: 2,
      chapter: 5,
      verseNumberStart: 1,
      verseNumberEnd: 17,
    });
  });
});

import { describe, expect, test } from "vitest";

import {
  improveSpeechRecognitionInput,
  parseVerseReferenceIntoParts,
} from "./improveSpeechRecognitionInput";

describe("improveSpeechRecognitionInput()", () => {
  test("should add missing colon between chapter and verse number for a single verse", () => {
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

  test("should add missing colon between chapter and verse number for a range of verses", () => {
    const transcript =
      "Galatians 522 to 23 But the fruit of the Spirit is love joy peace patience kindness goodness faithfulness gentleness and self control against such things there is no law Galatians 522 to 23";
    const expectedOutput =
      "Galatians 5:22-23 But the fruit of the Spirit is love joy peace patience kindness goodness faithfulness gentleness and self control against such things there is no law Galatians 5:22-23";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "Galatians 5:22-23",
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

  test("should convert word divider to dash for verse range", () => {
    const transcript =
      "Genesis 1 122 In the beginning God created the heavens and the earth Now the earth was formless and void and darkness was over the surface of the deep and the Spirit of God was hovering over the surface of the waters Genesis 1 122";
    const expectedOutput =
      "Genesis 1:1-2 In the beginning God created the heavens and the earth Now the earth was formless and void and darkness was over the surface of the deep and the Spirit of God was hovering over the surface of the waters Genesis 1:1-2";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "Genesis 1:1-2",
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

import { describe, expect, test } from "vitest";

import { improveSpeechRecognitionInput } from "./improveSpeechRecognitionInput";

describe("improveSpeechRecognitionInput()", () => {
  test("should add missing colon between chapter and verse number", () => {
    const transcript =
      "Genesis 11 In the beginning God created the heavens and the earth. Genesis 11";
    const expectedOutput =
      "Genesis 1:1 In the beginning God created the heavens and the earth. Genesis 1:1";

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
      "Genesis one one In the beginning God created the heavens and the earth. Genesis one one";
    const expectedOutput =
      "Genesis 1:1 In the beginning God created the heavens and the earth. Genesis 1:1";

    expect(
      improveSpeechRecognitionInput({
        transcript,
        verseReference: "Genesis 1:1",
        verseText: expectedOutput,
      }),
    ).toBe(expectedOutput);
  });
});

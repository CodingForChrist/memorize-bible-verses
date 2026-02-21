import { describe, expect, test } from "vitest";

import { autoCorrectSpeechRecognitionInput } from "./auto-correct-spoken-bible-verse";

describe("autoCorrectSpeechRecognitionInput()", () => {
  test("should add missing colon between chapter and verse number for a single verse", () => {
    const verseTextGenesisChapter1Verse1 =
      "Genesis 1:1 In the beginning God created the heavens and the earth Genesis 1:1";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Genesis 1:1",
        transcript:
          "Genesis 11 In the beginning God created the heavens and the earth Genesis 11",
        verseText: verseTextGenesisChapter1Verse1,
      }),
    ).toBe(verseTextGenesisChapter1Verse1);
  });

  test("should add missing colon between chapter and verse number for a range of verses", () => {
    const verseTextGalatiansChapter5Verses22To23 =
      "Galatians 5:22-23 But the fruit of the Spirit is love joy peace patience kindness goodness faithfulness gentleness and self control against such things there is no law Galatians 5:22-23";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Galatians 5:22-23",
        transcript:
          "Galatians 522 to 23 But the fruit of the Spirit is love joy peace patience kindness goodness faithfulness gentleness and self control against such things there is no law Galatians 522 to 23",
        verseText: verseTextGalatiansChapter5Verses22To23,
      }),
    ).toBe(verseTextGalatiansChapter5Verses22To23);
  });

  test("should convert spelled out numbers to actual numbers", () => {
    const verseTextGenesisChapter1Verse1 =
      "Genesis 1:1 In the beginning God created the heavens and the earth Genesis 1:1";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Genesis 1:1",
        transcript:
          "Genesis one one In the beginning God created the heavens and the earth Genesis one one",
        verseText: verseTextGenesisChapter1Verse1,
      }),
    ).toBe(verseTextGenesisChapter1Verse1);

    const verseTextPsalmChapter23Verses1To2 =
      "Psalm 23:1-2 The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters Psalm 23:1-2";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Psalm 23:1-2",
        transcript:
          "Psalm 23:1 through two The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters psalm 23 one through two",
        verseText: verseTextPsalmChapter23Verses1To2,
      }),
    ).toBe(verseTextPsalmChapter23Verses1To2);

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Psalm 23:1-2",
        transcript:
          "Psalm 231 through two The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters psalm 231 through two",
        verseText: verseTextPsalmChapter23Verses1To2,
      }),
    ).toBe(verseTextPsalmChapter23Verses1To2);
  });

  test("should match lowercase book names", () => {
    const verseTextPsalmChapter23Verses1To2 =
      "Psalm 23:1-2 The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters Psalm 23:1-2";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Psalm 23:1-2",
        transcript:
          "Psalm 23:1 through 2 The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters psalm 23 one through two",
        verseText: verseTextPsalmChapter23Verses1To2,
      }),
    ).toBe(verseTextPsalmChapter23Verses1To2);
  });

  test("should convert ordinal numbers for books of the bible", () => {
    const verseText2CorinthiansChapter5Verse7 =
      "2 Corinthians 5:7 For we walk by faith not by sight 2 Corinthians 5:7";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "2 Corinthians 5:7",
        transcript:
          "Second Corinthians 57 For we walk by faith not by sight second Corinthians 57",
        verseText: verseText2CorinthiansChapter5Verse7,
      }),
    ).toBe(verseText2CorinthiansChapter5Verse7);
  });

  test("should convert word divider to dash for verse range", () => {
    const verseTextGenesisChapter1Verses1To2 =
      "Genesis 1:1-2 In the beginning God created the heavens and the earth Now the earth was formless and void and darkness was over the surface of the deep and the Spirit of God was hovering over the surface of the waters Genesis 1:1-2";

    expect(
      autoCorrectSpeechRecognitionInput({
        transcript:
          "Genesis 1 122 In the beginning God created the heavens and the earth Now the earth was formless and void and darkness was over the surface of the deep and the Spirit of God was hovering over the surface of the waters Genesis 1 122",
        verseReference: "Genesis 1:1-2",
        verseText: verseTextGenesisChapter1Verses1To2,
      }),
    ).toBe(verseTextGenesisChapter1Verses1To2);

    const verseTextPsalmChapter23Verses1To2 =
      "Psalm 23:1-2 The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters Psalm 23:1-2";

    expect(
      autoCorrectSpeechRecognitionInput({
        verseReference: "Psalm 23:1-2",
        transcript:
          "Psalm 23:1 through 2 The Lord is my shepherd I shall not want He makes me lie down in green pastures He leads me beside quiet waters Psalm 23 one through two",
        verseText: verseTextPsalmChapter23Verses1To2,
      }),
    ).toBe(verseTextPsalmChapter23Verses1To2);
  });
});

import { describe, expect, test } from "vitest";

import { getTextDifferenceForBibleVerse } from "./textDifferenceForBibleVerse";

describe("getTextDifferenceForBibleVerse()", () => {
  test("should ignore punctuation differences", () => {
    expect(
      getTextDifferenceForBibleVerse({
        originalBibleVerseText:
          "2 Corinthians 5:17 Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come! 2 Corinthians 5:17",
        recitedBibleVerseText:
          "2 Corinthians 5:17 therefore if anyone is in Christ he is a new creation the old has passed away behold the new has come 2 Corinthians 5:17",
      }),
    ).toEqual(
      expect.objectContaining({
        errorCount: 0,
        wordCount: 36,
      }),
    );
  });

  test("should return expected error count", () => {
    expect(
      getTextDifferenceForBibleVerse({
        originalBibleVerseText:
          "2 Corinthians 5:17 Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come! 2 Corinthians 5:17",
        // missing "therefore"
        // missing "has passed away"
        // added "is gone"
        recitedBibleVerseText:
          "2 Corinthians 5:17 if anyone is in Christ he is a new creation the old is gone behold the new has come 2 Corinthians 5:17",
      }),
    ).toEqual(
      expect.objectContaining({
        errorCount: 6,
        wordCount: 38,
      }),
    );
  });
});

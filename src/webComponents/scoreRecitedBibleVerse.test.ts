import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { ScoreRecitedBibleVerse } from "./scoreRecitedBibleVerse";

describe("<score-recited-bible-verse>", () => {
  let scoreRecitedBibleVerseElement: ScoreRecitedBibleVerse;

  beforeEach(() => {
    scoreRecitedBibleVerseElement = document.createElement(
      "score-recited-bible-verse",
    ) as ScoreRecitedBibleVerse;
  });

  afterEach(() => {
    scoreRecitedBibleVerseElement.remove();
  });

  test("should render expected html for diff", async () => {
    document.body.appendChild(scoreRecitedBibleVerseElement);

    scoreRecitedBibleVerseElement.setAttribute(
      "original-bible-verse-text",
      "therefore if anyone is in Christ he is a new creation",
    );

    scoreRecitedBibleVerseElement.setAttribute(
      "recited-bible-verse-text",
      "if anyone is in Christ he is a brand new creation",
    );

    scoreRecitedBibleVerseElement.setAttribute("type", "diff");

    await scoreRecitedBibleVerseElement.updateComplete;

    expect(
      scoreRecitedBibleVerseElement.shadowRoot!.querySelector<HTMLSpanElement>(
        "span.added",
      )?.innerText,
    ).toContain("therefore");

    expect(
      scoreRecitedBibleVerseElement.shadowRoot!.querySelector<HTMLSpanElement>(
        "span.removed",
      )?.innerText,
    ).toContain("brand");
  });

  test.each([
    {
      originalBibleVerseText:
        "2 Corinthians 5:17 Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come! 2 Corinthians 5:17",
      // contains only punctuation differences
      recitedBibleVerseText:
        "2 Corinthians 5:17 therefore if anyone is in Christ he is a new creation the old has passed away behold the new has come 2 Corinthians 5:17",
      expectedGrade: { letter: "A+", percentage: 100 },
      wordCount: 27,
      errorCount: 0,
    },
    {
      originalBibleVerseText:
        "John 14:6 Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father except through Me. John 14:6",
      // contains only punctuation differences
      recitedBibleVerseText:
        "John 14:6 Jesus said to him I am the way the truth and the life No one comes to the Father except through Me John 14:6",
      expectedGrade: { letter: "A+", percentage: 100 },
      wordCount: 26,
      errorCount: 0,
    },
    {
      originalBibleVerseText:
        "John 3:16 “For God so loved the world, that He gave His only Son, so that everyone who believes in Him will not perish, but have eternal life. John 3:16",
      // contains only punctuation differences
      recitedBibleVerseText:
        "John 3:16 For God so loved the world that He gave His only Son so that everyone who believes in Him will not perish but have eternal life John 3:16",
      expectedGrade: { letter: "A+", percentage: 100 },
      wordCount: 30,
      errorCount: 0,
    },
    {
      originalBibleVerseText:
        "2 Corinthians 5:17 Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come! 2 Corinthians 5:17",
      // missing "therefore"
      // missing "has passed away"
      // added "is gone"
      recitedBibleVerseText:
        "2 Corinthians 5:17 if anyone is in Christ he is a new creation the old is gone behold the new has come 2 Corinthians 5:17",
      expectedGrade: { letter: "C", percentage: 77 },
      wordCount: 27,
      errorCount: 6,
    },
    {
      originalBibleVerseText:
        "John 14:6 Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father except through Me. John 14:6",
      // added "and"
      recitedBibleVerseText:
        "John 14:6 Jesus said to him I am the way and the truth and the life No one comes to the Father except through Me John 14:6",
      expectedGrade: { letter: "A", percentage: 96 },
      wordCount: 26,
      errorCount: 1,
    },
    {
      originalBibleVerseText:
        "John 14:6 Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father except through Me. John 14:6",
      // no matching words
      recitedBibleVerseText: "not even close",
      expectedGrade: { letter: "F", percentage: 0 },
      wordCount: 26,
      errorCount: 29,
    },
  ])(
    "should return expected grade",
    async ({
      originalBibleVerseText,
      recitedBibleVerseText,
      expectedGrade,
      wordCount,
      errorCount,
    }) => {
      document.body.appendChild(scoreRecitedBibleVerseElement);

      scoreRecitedBibleVerseElement.setAttribute(
        "original-bible-verse-text",
        originalBibleVerseText,
      );

      scoreRecitedBibleVerseElement.setAttribute(
        "recited-bible-verse-text",
        recitedBibleVerseText,
      );

      await scoreRecitedBibleVerseElement.updateComplete;

      expect(scoreRecitedBibleVerseElement.grade).toEqual(expectedGrade);
      expect(scoreRecitedBibleVerseElement.errorCount).toBe(errorCount);
      expect(scoreRecitedBibleVerseElement.wordCount).toBe(wordCount);
    },
  );
});

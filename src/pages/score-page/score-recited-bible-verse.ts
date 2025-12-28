import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { diffWords } from "diff";

@customElement("score-recited-bible-verse")
export class ScoreRecitedBibleVerse extends LitElement {
  @property({ attribute: "original-bible-verse-text", reflect: true })
  originalBibleVerseText?: string;

  @property({ attribute: "recited-bible-verse-text", reflect: true })
  recitedBibleVerseText?: string;

  @property({ reflect: true })
  type: "grade" | "diff" = "diff";

  wordCount: number = 0;
  errorCount: number = 0;

  static styles = css`
    :host {
      --text-added-color: #aceebb;
      --text-removed-color: #ffcecb;
    }
    .added {
      background-color: var(--text-added-color);
    }
    .removed {
      background-color: var(--text-removed-color);
    }
    .legend-container {
      margin-top: 1.5rem;
      font-size: 85%;
    }
    .legend-container > div {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .legend-container .added,
    .legend-container .removed {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 0.25rem;
    }
  `;

  get grade(): { letter: string; percentage: number } {
    let percentageInDecimal =
      (this.wordCount - this.errorCount) / this.wordCount;

    if (percentageInDecimal < 0) {
      percentageInDecimal = 0;
    }

    let letter: string;

    if (percentageInDecimal === 1) {
      letter = "A+";
    } else if (percentageInDecimal >= 0.9) {
      letter = "A";
    } else if (percentageInDecimal >= 0.8) {
      letter = "B";
    } else if (percentageInDecimal >= 0.7) {
      letter = "C";
    } else if (percentageInDecimal >= 0.6) {
      letter = "D";
    } else {
      letter = "F";
    }

    return {
      percentage: Math.floor(percentageInDecimal * 100),
      letter,
    };
  }

  render() {
    if (!this.originalBibleVerseText || !this.recitedBibleVerseText) {
      return;
    }

    const { wordCount, errorCount, differenceParts } = compareVerses({
      originalBibleVerseText: this.originalBibleVerseText,
      recitedBibleVerseText: this.recitedBibleVerseText,
    });

    this.wordCount = wordCount;
    this.errorCount = errorCount;

    if (this.type === "grade") {
      return html`${this.grade.letter} (${this.grade.percentage}%)`;
    }

    return html`
      <div class="text-difference-container">
        ${map(
          differenceParts,
          ({ text, added, removed }) =>
            html`<span class=${classMap({ added, removed })}>${text}</span>`,
        )}
      </div>
      <div class="legend-container">
        <div>
          <span class="added"></span>
          <span>Missed words in the verse</span>
        </div>
        <div>
          <span class="removed"></span>
          <span>Extra words not in the verse</span>
        </div>
      </div>
    `;
  }
}

function compareVerses({
  originalBibleVerseText,
  recitedBibleVerseText,
}: {
  originalBibleVerseText: string;
  recitedBibleVerseText: string;
}) {
  type TextDifferencePart = {
    text: string;
    added: boolean;
    removed: boolean;
  };

  const result = {
    wordCount: 0,
    errorCount: 0,
    differenceParts: [] as TextDifferencePart[],
  };

  if (!originalBibleVerseText || !recitedBibleVerseText) {
    return result;
  }

  const difference = diffWords(recitedBibleVerseText, originalBibleVerseText, {
    ignoreCase: true,
  });

  for (const [index, part] of difference.entries()) {
    const textWithoutPunctuation = removePunctuationFromText(part.value.trim());

    if (textWithoutPunctuation === "") {
      continue;
    }

    const partCount = textWithoutPunctuation.split(" ").length;
    const finalText =
      index === difference.length - 1
        ? textWithoutPunctuation
        : textWithoutPunctuation + " ";

    // do not count words that are not in the actual verse
    if (part.removed === false) {
      result.wordCount += partCount;
    }

    if (part.added || part.removed) {
      result.errorCount += partCount;
    }

    result.differenceParts.push({
      text: finalText,
      added: part.added,
      removed: part.removed,
    });
  }
  return result;
}

function removePunctuationFromText(text: string) {
  const punctuationCharacters = [".", ";", ",", "!", "¶", "“"];
  const hasLettersOrNumbersRegex = /[a-zA-Z0-9]/;

  // return empty string when text is only punctuation
  if (hasLettersOrNumbersRegex.test(text) === false) {
    return "";
  }

  let updatedText = text;
  for (const punctuationCharacter of punctuationCharacters) {
    if (updatedText.includes(punctuationCharacter)) {
      updatedText = updatedText.replaceAll(punctuationCharacter, "");
    }
  }
  return updatedText;
}

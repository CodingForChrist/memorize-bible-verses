import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { classMap } from "lit/directives/class-map.js";
import { diffWords } from "diff";

@customElement("score-recited-bible-verse")
export class ScoreRecitedBibleVerse extends LitElement {
  @property({ attribute: "original-bible-verse-text", reflect: true })
  originalBibleVerseText?: string;

  @property({ attribute: "recited-bible-verse-text", reflect: true })
  recitedBibleVerseText?: string;

  @state()
  wordCount: number = 0;

  @state()
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
      return null;
    }

    this.wordCount = 0;
    this.errorCount = 0;

    const difference = diffWords(
      this.recitedBibleVerseText,
      this.originalBibleVerseText,
      {
        ignoreCase: true,
      },
    );

    return html`
      <div>
        ${difference.map((part, index) => {
          const textWithoutPunctuation = removePunctuationFromText(
            part.value.trim(),
          );

          if (textWithoutPunctuation === "") {
            return null;
          }

          const partCount = textWithoutPunctuation.split(" ").length;
          const finalText =
            index === difference.length - 1
              ? textWithoutPunctuation
              : textWithoutPunctuation + " ";

          const classes = {
            added: part.added,
            removed: part.removed,
          };

          // do not count words that are not in the actual verse
          if (part.removed === false) {
            this.wordCount += partCount;
          }

          if (part.added || part.removed) {
            this.errorCount += partCount;
          }

          return html`<span class=${classMap(classes)}>${finalText}</span>`;
        })}
      </div>
    `;
  }
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

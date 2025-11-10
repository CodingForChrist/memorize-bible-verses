import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";

import { convertBibleVerseToText } from "../services/formatApiResponse";
import { getTextDifferenceForBibleVerse } from "../services/compareBibleVerses";

import bibleTranslations from "../data/bibleTranslations.json";

@customElement("accuracy-report")
export class AccuracyReport extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-content", reflect: true })
  verseContent?: string;

  @property({ attribute: "recited-bible-verse", reflect: true })
  recitedBibleVerse?: string;

  static styles = [
    unsafeCSS(scriptureStyles),
    css`
      :host {
        display: block;
      }
      table {
        table-layout: auto;
        text-indent: 0;
        border-color: inherit;
        border-collapse: collapse;
      }
      td {
        border-bottom: 1px solid var(--color-light-gray);
        padding: 1rem 0;
      }
      td:first-child {
        padding-right: 2rem;
      }
      bible-verse-blockquote .scripture-styles {
        color: var(--color-gray);
      }
    `,
  ];

  #findBibleTranslationById(bibleId: string) {
    const bibleTranslation = bibleTranslations.find(
      (bibleTranslation) => bibleTranslation.id === bibleId,
    );
    if (!bibleTranslation) {
      throw new Error("Failed to find the bible translation by id");
    }
    return bibleTranslation;
  }

  #calculateGrade({
    wordCount,
    errorCount,
  }: {
    wordCount: number;
    errorCount: number;
  }) {
    const percentageInDecimal = (wordCount - errorCount) / wordCount;
    let gradeLetter: string;

    if (percentageInDecimal === 1) {
      gradeLetter = "A+";
    } else if (percentageInDecimal >= 0.9) {
      gradeLetter = "A";
    } else if (percentageInDecimal >= 0.8) {
      gradeLetter = "B";
    } else if (percentageInDecimal >= 0.7) {
      gradeLetter = "C";
    } else if (percentageInDecimal >= 0.6) {
      gradeLetter = "D";
    } else {
      gradeLetter = "F";
    }

    return {
      percentage: Math.floor(percentageInDecimal * 100),
      gradeLetter,
    };
  }

  render() {
    if (
      !this.bibleId ||
      !this.verseReference ||
      !this.verseContent ||
      !this.recitedBibleVerse
    ) {
      return null;
    }

    // add reference and strip out html characters
    const verseText = `${this.verseReference} ${convertBibleVerseToText(this.verseContent)} ${this.verseReference}`;

    const { textDifferenceDivContainer, errorCount, wordCount } =
      getTextDifferenceForBibleVerse({
        originalBibleVerseText: verseText,
        recitedBibleVerseText: this.recitedBibleVerse,
      });

    const { percentage, gradeLetter } = this.#calculateGrade({
      wordCount,
      errorCount,
    });

    return html`
      <table>
        <tbody>
          <tr>
            <td>Grade</td>
            <td>${gradeLetter} (${percentage}%)</td>
          </tr>
          <tr>
            <td>Bible</td>
            <td>
              ${this.#findBibleTranslationById(this.bibleId).abbreviationLocal}
            </td>
          </tr>
          <tr>
            <td>Verse Reference</td>
            <td>${this.verseReference}</td>
          </tr>
          <tr>
            <td>Actual Verse</td>
            <td>
              <bible-verse-blockquote>
                <span class="scripture-styles" slot="bible-verse-content">
                  ${unsafeHTML(this.verseContent)}
                </span>
              </bible-verse-blockquote>
            </td>
          </tr>
          <tr>
            <td>Recited Verse</td>
            <td>${this.recitedBibleVerse}</td>
          </tr>
          <tr>
            <td>Text Difference</td>
            <td>${unsafeHTML(textDifferenceDivContainer.innerHTML)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

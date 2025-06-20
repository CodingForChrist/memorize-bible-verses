import { diffWords } from "diff";

import { getTemplate } from "./utils";
import { convertBibleVerseToText } from "../formatBibleVerse";

export class AccuracyReport extends HTMLElement {
  static get observedAttributes() {
    return ["recited-bible-verse"];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get verseContent() {
    return this.getAttribute("verse-content");
  }

  get recitedBibleVerse() {
    return this.getAttribute("recited-bible-verse");
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
      gradeLetter = "A+";
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

  #renderReport() {
    this.innerHTML = "";

    if (this.verseReference && this.verseContent && this.recitedBibleVerse) {
      // add reference and strip out html characters
      const verseText = `${this.verseReference} ${convertBibleVerseToText(this.verseContent)} ${this.verseReference}`;

      const { textDifferenceDocumentFragment, errorCount, wordCount } =
        getDifferenceBetweenVerseAndInput({
          originalBibleVerseText: verseText,
          recitedBibleVerseText: this.recitedBibleVerse,
        });

      const accurancyReportElement = getTemplate("accuracy-report-template");
      const gradeSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="grade"]',
        );

      if (gradeSlot) {
        const { percentage, gradeLetter } = this.#calculateGrade({
          wordCount,
          errorCount,
        });
        gradeSlot.innerText = `${gradeLetter} (${percentage}%)`;
      }

      const errorCountSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="error-count"]',
        );

      if (errorCountSlot) {
        errorCountSlot.innerText = String(errorCount);
      }

      const verseReferenceSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="verse-reference"]',
        );

      if (verseReferenceSlot) {
        verseReferenceSlot.innerText = this.verseReference;
      }

      const actualVerseSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="actual-verse"]',
        );

      if (actualVerseSlot) {
        actualVerseSlot.innerHTML = this.verseContent;
      }

      const recitedVerseSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="recited-verse"]',
        );

      if (recitedVerseSlot) {
        recitedVerseSlot.innerText = this.recitedBibleVerse;
      }

      const textDifferenceSlot =
        accurancyReportElement.querySelector<HTMLSlotElement>(
          'slot[name="text-difference"]',
        );

      if (textDifferenceSlot) {
        textDifferenceSlot.append(textDifferenceDocumentFragment);
      }

      this.append(accurancyReportElement);
    } else {
      this.#renderErrorMessage(
        "Unable to display report. Please complete Step 1 and Step 2 first.",
      );
    }
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = getTemplate("alert-error-template");
    const errorMessageSlot = alertErrorElement.querySelector<HTMLSlotElement>(
      'slot[name="error-message"]',
    );

    if (errorMessageSlot) {
      errorMessageSlot.innerText = message;
      this.append(alertErrorElement);
    }
  }

  connectedCallback() {
    this.#renderReport();
  }

  attributeChangedCallback(name: string) {
    if (name !== "recited-bible-verse") {
      return;
    }
    this.#renderReport();
  }
}

type GetDifferenceBetweenVerseAndInputOptions = {
  originalBibleVerseText: string;
  recitedBibleVerseText: string;
};

function getDifferenceBetweenVerseAndInput({
  originalBibleVerseText,
  recitedBibleVerseText,
}: GetDifferenceBetweenVerseAndInputOptions) {
  const difference = diffWords(recitedBibleVerseText, originalBibleVerseText, {
    ignoreCase: true,
  });

  const fragment = document.createDocumentFragment();
  let errorCount = 0;
  for (const part of difference) {
    // green for additions, red for deletions
    // grey for common parts
    let color = "grey";

    if (part.added) {
      // ignore punctuation
      if (![".", ";", ",", "¶"].includes(part.value.trim())) {
        color = "green";
        errorCount++;
      }
    }

    if (part.removed) {
      color = "red";
      errorCount++;
    }

    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  }

  return {
    textDifferenceDocumentFragment: fragment,
    errorCount: errorCount,
    wordCount: difference.length,
  };
}

window.customElements.define("accuracy-report", AccuracyReport);

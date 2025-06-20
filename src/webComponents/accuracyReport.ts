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

  #renderReport() {
    this.innerHTML = "";

    if (this.verseReference && this.verseContent && this.recitedBibleVerse) {
      // add reference and strip out html characters
      const verseText = `${this.verseReference} ${convertBibleVerseToText(this.verseContent)} ${this.verseReference}`;

      const results = getDifferenceBetweenVerseAndInput({
        originalBibleVerseText: verseText,
        recitedBibleVerseText: this.recitedBibleVerse,
      });

      this.append(results);
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

  return fragment;
}

window.customElements.define("accuracy-report", AccuracyReport);

import { diffWords } from "diff";

import { LOADING_STATES, type LoadingStates } from "../constants";

import type { BibleVerse } from "../types";

export class AccuracyReport extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;
  #recitedBibleVerse?: string;

  constructor() {
    super();

    this.loadingState = LOADING_STATES.INITIAL;
  }

  static get observedAttributes() {
    return ["loading-state"];
  }

  get loadingState() {
    return this.getAttribute("loading-state") as LoadingStates;
  }

  set loadingState(value: LoadingStates) {
    this.setAttribute("loading-state", value);
  }

  get selectedBibleVerse(): BibleVerse | undefined {
    return this.#selectedBibleVerse;
  }

  set selectedBibleVerse(value: BibleVerse) {
    this.#selectedBibleVerse = value;

    this.loadingState = LOADING_STATES.PENDING;
  }

  get recitedBibleVerse(): string | undefined {
    return this.#recitedBibleVerse;
  }

  set recitedBibleVerse(value: string) {
    this.#recitedBibleVerse = value;

    if (this.selectedBibleVerse) {
      this.loadingState = LOADING_STATES.RESOLVED;
    }
  }

  #renderReport() {
    if (this.selectedBibleVerse?.content && this.recitedBibleVerse) {
      // add reference and strip out html characters
      const verseText = `${this.selectedBibleVerse.reference} ${getVerseTextFromHTML(this.selectedBibleVerse.content)} ${this.selectedBibleVerse.reference}`;

      const results = getDifferenceBetweenVerseAndInput({
        originalBibleVerseText: verseText,
        recitedBibleVerseText: this.recitedBibleVerse,
      });

      this.append(results);
    }
  }

  attributeChangedCallback(name: string) {
    if (name !== "loading-state") {
      return;
    }

    // wait until both the bible verse and recited bible verse and received
    if (this.loadingState === LOADING_STATES.RESOLVED) {
      this.#renderReport();
    }
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

function getVerseTextFromHTML(verseContent: BibleVerse["content"]) {
  const divElement = document.createElement("div");
  divElement.innerHTML = verseContent;
  // remove verse numbers
  divElement
    .querySelectorAll("[data-number]")
    ?.forEach((element) => element.remove());

  return divElement.innerText;
}

window.customElements.define("accuracy-report", AccuracyReport);

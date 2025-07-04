import { CUSTOM_EVENTS } from "../constants";

import type { BibleTranslation, BibleVerse } from "../types";

export class AppStateProvider extends HTMLElement {
  selectedBibleId?: BibleTranslation["id"];
  selectedBibleVerse?: BibleVerse;
  recitedBibleVerse?: string;

  constructor() {
    super();

    if (!hasSupportForSpeechRecognition()) {
      this.innerHTML = "";
      this.#renderErrorMessage(
        "Your browser does not support the Web Speech API. Please try another browser like Chrome or Safari.",
      );
    }
  }

  #updateChildrenWithSelectedBibleId() {
    const bibleVerseSelectorElement = this.querySelector(
      "bible-verse-selector",
    );
    if (bibleVerseSelectorElement && this.selectedBibleId) {
      bibleVerseSelectorElement.setAttribute(
        "selected-bible-id",
        this.selectedBibleId,
      );
    }
  }

  #updateChildrenWithSelectedBibleVerse() {
    if (!this.selectedBibleVerse) {
      return;
    }

    const { id, reference, content } = this.selectedBibleVerse;
    const reciteBibleVerseElement = this.querySelector("recite-bible-verse");
    const accuracyReportElement = this.querySelector("accuracy-report");

    for (const element of [reciteBibleVerseElement, accuracyReportElement]) {
      if (element) {
        element.setAttribute("verse-id", id);
        element.setAttribute("verse-reference", reference);
        element.setAttribute("verse-content", content);
      }
    }
  }

  #updateChildrenWithRecitedBibleVerse() {
    const accuracyReportElement = this.querySelector("accuracy-report");

    if (accuracyReportElement && this.recitedBibleVerse) {
      accuracyReportElement.setAttribute(
        "recited-bible-verse",
        this.recitedBibleVerse,
      );
    }
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;
    this.appendChild(alertErrorElement);
  }

  connectedCallback() {
    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_TRANSLATION,
      (event: Event) => {
        const customEvent = event as CustomEvent;
        this.selectedBibleId = customEvent.detail.selectedBibleTranslation.id;
        this.#updateChildrenWithSelectedBibleId();
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_VERSE,
      (event: Event) => {
        const customEvent = event as CustomEvent;
        this.selectedBibleVerse = customEvent.detail.selectedBibleVerse;
        this.#updateChildrenWithSelectedBibleVerse();
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      (event: Event) => {
        const customEvent = event as CustomEvent;
        this.recitedBibleVerse = customEvent.detail.recitedBibleVerse;
        this.#updateChildrenWithRecitedBibleVerse();
      },
    );
  }
}

function hasSupportForSpeechRecognition() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

window.customElements.define("app-state-provider", AppStateProvider);

import { CUSTOM_EVENTS } from "../constants";

import type {
  BibleTranslation,
  BibleVerse,
  CustomEventUpdateBibleTranslation,
  CustomEventUpdateBibleVerse,
  CustomEventUpdateRecitedBibleVerse,
} from "../types";

export class AppStateProvider extends HTMLElement {
  constructor() {
    super();

    if (!hasSupportForSpeechRecognition()) {
      this.innerHTML = "";
      this.#renderErrorMessage(
        "Your browser does not support the Web Speech API. Please try another browser like Chrome or Safari.",
      );
    }
  }

  #updateChildrenWithBibleTranslation({
    id,
    name,
    abbreviationLocal,
  }: BibleTranslation) {
    for (const element of [
      this.querySelector("bible-verse-selector"),
      this.querySelector("accuracy-report"),
    ]) {
      if (element) {
        element.setAttribute("bible-id", id);
        element.setAttribute("bible-name", name);
        element.setAttribute("bible-abbreviation-local", abbreviationLocal);
      }
    }
  }

  #updateChildrenWithBibleVerse({ id, reference, content }: BibleVerse) {
    for (const element of [
      this.querySelector("recite-bible-verse"),
      this.querySelector("accuracy-report"),
    ]) {
      if (element) {
        element.setAttribute("verse-id", id);
        element.setAttribute("verse-reference", reference);
        element.setAttribute("verse-content", content);
      }
    }
  }

  #updateChildrenWithRecitedBibleVerse(recitedBibleVerse: string) {
    const accuracyReportElement = this.querySelector("accuracy-report");

    if (accuracyReportElement) {
      accuracyReportElement.setAttribute(
        "recited-bible-verse",
        recitedBibleVerse,
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
      CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
      (event: CustomEventInit<CustomEventUpdateBibleTranslation>) => {
        const bibleTranslation = event.detail?.bibleTranslation;
        if (bibleTranslation) {
          this.#updateChildrenWithBibleTranslation(bibleTranslation);
        }
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateBibleVerse>) => {
        const bibleVerse = event.detail?.bibleVerse;
        if (bibleVerse) {
          this.#updateChildrenWithBibleVerse(bibleVerse);
        }
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateRecitedBibleVerse>) => {
        const recitedBibleVerse = event.detail?.recitedBibleVerse;
        if (recitedBibleVerse) {
          this.#updateChildrenWithRecitedBibleVerse(recitedBibleVerse);
        }
      },
    );
  }
}

function hasSupportForSpeechRecognition() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

window.customElements.define("app-state-provider", AppStateProvider);

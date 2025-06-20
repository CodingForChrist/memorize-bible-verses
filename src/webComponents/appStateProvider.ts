import { getTemplate } from "./utils";
import { AccuracyReport } from "./accuracyReport";
import { CUSTOM_EVENTS } from "../constants";

import type { BibleTranslation, BibleVerse } from "../types";

export class AppStateProvider extends HTMLElement {
  selectedBibleId?: BibleTranslation["id"];
  selectedBibleVerse?: BibleVerse;
  recitedBibleVerse?: string;

  #templates: {
    alertError: DocumentFragment;
  };

  constructor() {
    super();

    this.#templates = {
      alertError: getTemplate("alert-error-template"),
    };

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
    const accuracyReportElement =
      this.querySelector<AccuracyReport>("accuracy-report");

    if (accuracyReportElement && this.selectedBibleVerse) {
      accuracyReportElement.selectedBibleVerse = this.selectedBibleVerse;
    }
  }

  #updateChildrenWithRecitedBibleVerse() {
    const accuracyReportElement =
      this.querySelector<AccuracyReport>("accuracy-report");

    if (accuracyReportElement && this.recitedBibleVerse) {
      accuracyReportElement.recitedBibleVerse = this.recitedBibleVerse;
    }
  }

  #renderErrorMessage(message: string) {
    const errorMessageSlot =
      this.#templates.alertError.querySelector<HTMLSlotElement>(
        'slot[name="error-message"]',
      );

    if (errorMessageSlot) {
      errorMessageSlot.innerText = message;
      this.append(this.#templates.alertError);
    }
  }

  connectedCallback() {
    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_TRANSLATION,
      (event: Event) => {
        const customEvent = event as CustomEvent;
        this.selectedBibleId = customEvent.detail.selectedBibleId;
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

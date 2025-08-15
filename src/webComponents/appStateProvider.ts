import { CUSTOM_EVENTS } from "../constants";

import type {
  BibleTranslation,
  BibleVerse,
  CustomEventUpdateBibleTranslation,
  CustomEventUpdateBibleVerse,
  CustomEventUpdateRecitedBibleVerse,
  CustomEventNavigateToPage,
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
      this.querySelector("search-advanced-page"),
      this.querySelector("score-page"),
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
      this.querySelector("search-advanced-page"),
      this.querySelector("speak-page"),
      this.querySelector("score-page"),
    ]) {
      if (element) {
        element.setAttribute("verse-id", id);
        element.setAttribute("verse-reference", reference);
        element.setAttribute("verse-content", content);
      }
    }
  }

  #updateChildrenWithRecitedBibleVerse(recitedBibleVerse: string) {
    const accuracyReportElement = this.querySelector("score-page");

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

  #updatePageNavigation(pageName: string) {
    for (const element of [
      this.querySelector<HTMLElement>("instructions-page"),
      this.querySelector<HTMLElement>("search-advanced-page"),
      this.querySelector<HTMLElement>("speak-page"),
      this.querySelector<HTMLElement>("score-page"),
    ]) {
      if (!element) {
        return;
      }
      element.style.display =
        element === this.querySelector(pageName) ? "block" : "none";
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has("page-name")) {
      url.searchParams.set("page-name", pageName);
    } else {
      url.searchParams.append("page-name", pageName);
    }
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
  }

  #navigateToPageBasedOnURLParam() {
    const url = new URL(window.location.href);
    const pageName = url.searchParams.get("page-name") || "instructions-page";
    this.#updatePageNavigation(pageName);
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

    window.addEventListener(
      CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
      (event: CustomEventInit<CustomEventNavigateToPage>) => {
        const pageName = event.detail?.pageName;
        if (pageName) {
          this.#updatePageNavigation(pageName);
        }
      },
    );

    addEventListener("popstate", () => {
      this.#navigateToPageBasedOnURLParam();
    });

    window.history.scrollRestoration = "manual";
    this.#navigateToPageBasedOnURLParam();
  }
}

function hasSupportForSpeechRecognition() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

window.customElements.define("app-state-provider", AppStateProvider);

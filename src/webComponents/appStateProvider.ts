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
      const isVisible = element === this.querySelector(pageName);
      element.setAttribute("is-visible", String(isVisible));
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

window.customElements.define("app-state-provider", AppStateProvider);

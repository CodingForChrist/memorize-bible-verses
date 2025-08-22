import { CUSTOM_EVENTS } from "../constants";

import type {
  BibleTranslation,
  BibleVerse,
  CustomEventUpdateBibleTranslation,
  CustomEventUpdateBibleVerse,
  CustomEventUpdateRecitedBibleVerse,
  CustomEventNavigateToPage,
  PageNavigation,
} from "../types";

export class AppStateProvider extends HTMLElement {
  #updateChildrenWithBibleTranslation({
    id,
    name,
    abbreviationLocal,
  }: BibleTranslation) {
    for (const element of [
      this.querySelector("search-verses-for-awana-truth-and-training-page"),
      this.querySelector("search-verses-for-awana-sparks-page"),
      this.querySelector("search-verses-for-sharing-the-gospel-page"),
      this.querySelector("search-psalm-23-page"),
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

  #updatePageNavigation({ previousPage, nextPage }: PageNavigation) {
    for (const element of [
      this.querySelector("instructions-page"),
      this.querySelector("search-options-page"),
      this.querySelector("search-verses-for-awana-truth-and-training-page"),
      this.querySelector("search-verses-for-awana-sparks-page"),
      this.querySelector("search-verses-for-sharing-the-gospel-page"),
      this.querySelector("search-psalm-23-page"),
      this.querySelector("search-advanced-page"),
      this.querySelector("speak-page"),
      this.querySelector("score-page"),
    ]) {
      if (!element) {
        return;
      }
      const isVisible = element === this.querySelector(nextPage);
      element.setAttribute("is-visible", String(isVisible));
      if (previousPage) {
        element.setAttribute("previous-page", previousPage);
      }
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has("page-name")) {
      url.searchParams.set("page-name", nextPage);
    } else {
      url.searchParams.append("page-name", nextPage);
    }
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
  }

  #navigateToPageBasedOnURLParam() {
    const url = new URL(window.location.href);
    const nextPage = url.searchParams.get("page-name") || "instructions-page";
    this.#updatePageNavigation({ nextPage });
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
        const pageNavigation = event.detail?.pageNavigation;
        if (pageNavigation) {
          this.#updatePageNavigation(pageNavigation);
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

import { CUSTOM_EVENTS } from "../constants";
import { router } from "../services/router";

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
  get #webComponentPageElements() {
    return [
      this.querySelector("instructions-page"),
      this.querySelector("search-options-page"),
      this.querySelector("search-verse-of-the-day-page"),
      this.querySelector("search-verses-for-sharing-the-gospel-page"),
      this.querySelector("search-psalm-23-page"),
      this.querySelector("search-verses-for-awana-page"),
      this.querySelector("search-advanced-page"),
      this.querySelector("speak-page"),
      this.querySelector("type-verse-from-memory-page"),
      this.querySelector("score-page"),
    ];
  }

  #updateChildrenWithBibleTranslation({
    id,
    abbreviationLocal,
  }: BibleTranslation) {
    for (const element of this.#webComponentPageElements) {
      if (element) {
        element.setAttribute("bible-id", id);
      }
    }

    router.setParams({
      params: {
        translation: abbreviationLocal,
      },
      shouldUpdateBrowserHistory: false,
    });
  }

  #updateChildrenWithBibleVerse({ id, reference, content }: BibleVerse) {
    for (const element of [
      this.querySelector("speak-page"),
      this.querySelector("type-verse-from-memory-page"),
      this.querySelector("score-page"),
    ]) {
      if (element) {
        element.setAttribute("verse-id", id);
        element.setAttribute("verse-reference", reference);
        element.setAttribute("verse-content", content);
      }
    }

    router.setParams({
      params: {
        verse: reference,
      },
      shouldUpdateBrowserHistory: false,
    });
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

  #updatePageNavigation({
    previousPage,
    nextPage,
    bibleTranslation,
    shouldUpdateBrowserHistory = true,
  }: PageNavigation) {
    for (const element of this.#webComponentPageElements) {
      if (!element) {
        continue;
      }

      const isActivePage = element === this.querySelector(nextPage);
      element.setAttribute("is-visible", String(isActivePage));
      if (isActivePage && previousPage) {
        element.setAttribute("previous-page", previousPage);
      }
    }

    router.setParams({
      params: {
        page: nextPage,
        translation: bibleTranslation,
      },
      shouldUpdateBrowserHistory,
    });
  }

  #viewTransitionForPageNavigation(pageNavigation: PageNavigation) {
    // fallback for browsers that don't support the View Transition API
    if (!document.startViewTransition) {
      this.#updatePageNavigation(pageNavigation);
      window.scrollTo(0, 0);
      return;
    }

    // View Transition API
    const transition = document.startViewTransition(() =>
      this.#updatePageNavigation(pageNavigation),
    );

    transition.ready.then(() => {
      // scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  connectedCallback() {
    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
      (event: CustomEventInit<CustomEventUpdateBibleTranslation>) => {
        const bibleTranslation = event.detail?.bibleTranslation;
        if (bibleTranslation !== undefined) {
          this.#updateChildrenWithBibleTranslation(bibleTranslation);
        }
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateBibleVerse>) => {
        const bibleVerse = event.detail?.bibleVerse;
        if (bibleVerse !== undefined) {
          this.#updateChildrenWithBibleVerse(bibleVerse);
        }
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateRecitedBibleVerse>) => {
        const recitedBibleVerse = event.detail?.recitedBibleVerse;
        if (recitedBibleVerse !== undefined) {
          this.#updateChildrenWithRecitedBibleVerse(recitedBibleVerse);
        }
      },
    );

    window.addEventListener(
      CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
      (event: CustomEventInit<CustomEventNavigateToPage>) => {
        const pageNavigation = event.detail?.pageNavigation;
        if (!pageNavigation) {
          return;
        }

        this.#viewTransitionForPageNavigation(pageNavigation);
      },
    );

    // Initial page navigation
    router.navigateToPageBasedOnURLParam({
      shouldUpdateBrowserHistory: true,
    });

    router.setupPopStateListenerForBrowserHistory();
  }
}

window.customElements.define("app-state-provider", AppStateProvider);

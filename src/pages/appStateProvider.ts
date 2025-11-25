import { LitElement, css, html, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";
import { choose } from "lit/directives/choose.js";

import { CUSTOM_EVENT, PAGE_NAME, type PageName } from "../constants";
import { getStateFromURL, setStateInURL } from "../services/router";

import type {
  BibleTranslation,
  BibleVerse,
  CustomEventUpdateBibleTranslation,
  CustomEventUpdateBibleVerse,
  CustomEventUpdateRecitedBibleVerse,
  CustomEventNavigateToPage,
  PageNavigation,
} from "../types";

@customElement("app-state-provider")
export class AppStateProvider extends LitElement {
  @state()
  selectedBibleTranslation?: BibleTranslation;

  @state()
  selectedBibleVerse?: BibleVerse;

  @state()
  recitedBibleVerse?: string;

  @state()
  currentPage: PageName =
    getStateFromURL()?.pageName ?? PAGE_NAME.INSTRUCTIONS_PAGE;

  // previousPage is used to keep track of the search page used
  // so the back button will return to it
  @state()
  previousPage?: PageName;

  static styles = css`
    *,
    ::before,
    ::after {
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();

    window.history.scrollRestoration = "manual";

    window.addEventListener("popstate", () => {
      const nextPage =
        getStateFromURL()?.pageName ?? PAGE_NAME.INSTRUCTIONS_PAGE;
      this.#goto({ nextPage });
    });

    this.addEventListener(
      CUSTOM_EVENT.NAVIGATE_TO_PAGE,
      (event: CustomEventInit<CustomEventNavigateToPage>) => {
        const pageNavigation = event.detail?.pageNavigation;
        if (pageNavigation) {
          this.#viewTransitionForPageNavigation(pageNavigation);
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENT.UPDATE_BIBLE_TRANSLATION,
      (event: CustomEventInit<CustomEventUpdateBibleTranslation>) => {
        const bibleTranslation = event.detail?.bibleTranslation;
        if (bibleTranslation) {
          this.selectedBibleTranslation = bibleTranslation;
          setStateInURL({
            pageName: this.currentPage,
            translation: bibleTranslation.abbreviationLocal,
            shouldUpdateBrowserHistory: false,
          });
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENT.UPDATE_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateBibleVerse>) => {
        const bibleVerse = event.detail?.bibleVerse;
        if (bibleVerse) {
          this.selectedBibleVerse = bibleVerse;
          this.recitedBibleVerse = undefined;
          setStateInURL({
            pageName: this.currentPage,
            verse: bibleVerse.reference,
            shouldUpdateBrowserHistory: false,
          });
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENT.UPDATE_RECITED_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateRecitedBibleVerse>) => {
        const recitedBibleVerse = event.detail?.recitedBibleVerse;
        if (recitedBibleVerse) {
          this.recitedBibleVerse = recitedBibleVerse;
        }
      },
    );
  }

  render() {
    return choose(
      this.currentPage,
      [
        [
          PAGE_NAME.INSTRUCTIONS_PAGE,
          () => html`<instructions-page></instructions-page>`,
        ],
        [
          PAGE_NAME.SEARCH_OPTIONS_PAGE,
          () => html`<search-options-page></search-options-page>`,
        ],
        [
          PAGE_NAME.SEARCH_VERSE_OF_THE_DAY_PAGE,
          () =>
            html`<search-verse-of-the-day-page
              bible-id=${this.selectedBibleTranslation?.id || nothing}
            ></search-verse-of-the-day-page>`,
        ],
        [
          PAGE_NAME.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
          () =>
            html`<search-verses-for-sharing-the-gospel-page
              bible-id=${this.selectedBibleTranslation?.id}
            ></search-verses-for-sharing-the-gospel-page>`,
        ],
        [
          PAGE_NAME.SEARCH_PSALM_23_PAGE,
          () =>
            html`<search-psalm-23-page
              bible-id=${this.selectedBibleTranslation?.id || nothing}
            ></search-psalm-23-page>`,
        ],
        [
          PAGE_NAME.SEARCH_VERSES_FOR_AWANA_PAGE,
          () =>
            html`<search-verses-for-awana-page
              bible-id=${this.selectedBibleTranslation?.id || nothing}
            ></search-verses-for-awana-page>`,
        ],
        [
          PAGE_NAME.SEARCH_ADVANCED_PAGE,
          () =>
            html`<search-advanced-page
              bible-id=${this.selectedBibleTranslation?.id || nothing}
            ></search-advanced-page>`,
        ],
        [
          PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
          () =>
            html`<speak-verse-from-memory-page
              verse-reference=${this.selectedBibleVerse?.reference || nothing}
              verse-content=${this.selectedBibleVerse?.content || nothing}
              recited-bible-verse=${this.recitedBibleVerse || nothing}
              previous-page=${this.previousPage || nothing}
            ></speak-verse-from-memory-page>`,
        ],
        [
          PAGE_NAME.SCORE_PAGE,
          () =>
            html`<score-page
              bible-id=${this.selectedBibleTranslation?.id || nothing}
              verse-reference=${this.selectedBibleVerse?.reference || nothing}
              verse-content=${this.selectedBibleVerse?.content || nothing}
              recited-bible-verse=${this.recitedBibleVerse || nothing}
            ></score-page>`,
        ],
      ],
      () => html`<instructions-page></instructions-page>`,
    );
  }

  #viewTransitionForPageNavigation(pageNavigation: PageNavigation) {
    setStateInURL({
      pageName: pageNavigation.nextPage,
      shouldUpdateBrowserHistory: true,
    });

    // fallback for browsers that don't support the View Transition API
    if (!document.startViewTransition) {
      this.#goto(pageNavigation);
      window.scrollTo(0, 0);
      return;
    }

    // View Transition API
    const transition = document.startViewTransition(() => {
      this.#goto(pageNavigation);
    });

    transition.ready.then(() => {
      // scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  #goto({ nextPage, previousPage }: PageNavigation) {
    this.currentPage = nextPage;
    if (previousPage) this.previousPage = previousPage;
  }
}

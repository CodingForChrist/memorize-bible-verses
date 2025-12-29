import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { CUSTOM_EVENT, PAGE_NAME, type PageName } from "../constants";
import {
  getStateFromURL,
  setStateInURL,
  deleteUnknownParametersInURL,
} from "../services/router";

import "./instructions-page/instructions-page";
import "./search-options-page/search-options-page";
import "./advanced-search-page/advanced-search-page";
import "./psalm-23-page/psalm-23-page";
import "./verses-for-awana-page/verses-for-awana-page";
import "./verse-of-the-day-page/verse-of-the-day-page";
import "./share-the-gospel-page/share-the-gospel-page";
import "./speak-verse-from-memory-page/speak-verse-from-memory-page";
import "./score-page/score-page";

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

    globalThis.history.scrollRestoration = "manual";
    deleteUnknownParametersInURL();

    globalThis.addEventListener("popstate", () => {
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
            verse:
              this.selectedBibleVerse?.reference ?? getStateFromURL()?.verse,
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
          PAGE_NAME.VERSE_OF_THE_DAY_PAGE,
          () => html`
            <verse-of-the-day-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
            ></verse-of-the-day-page>
          `,
        ],
        [
          PAGE_NAME.SHARE_THE_GOSPEL_PAGE,
          () => html`
            <share-the-gospel-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
            ></share-the-gospel-page>
          `,
        ],
        [
          PAGE_NAME.PSALM_23_PAGE,
          () => html`
            <psalm-23-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
            ></psalm-23-page>
          `,
        ],
        [
          PAGE_NAME.VERSES_FOR_AWANA_PAGE,
          () => html`
            <verses-for-awana-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
            ></verses-for-awana-page>
          `,
        ],
        [
          PAGE_NAME.ADVANCED_SEARCH_PAGE,
          () => html`
            <advanced-search-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
            ></advanced-search-page>
          `,
        ],
        [
          PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
          () => html`
            <speak-verse-from-memory-page
              verse-reference=${ifDefined(this.selectedBibleVerse?.reference)}
              verse-content=${ifDefined(this.selectedBibleVerse?.content)}
              recited-bible-verse=${ifDefined(this.recitedBibleVerse)}
              previous-page=${ifDefined(this.previousPage)}
            ></speak-verse-from-memory-page>
          `,
        ],
        [
          PAGE_NAME.SCORE_PAGE,
          () => html`
            <score-page
              bible-id=${ifDefined(this.selectedBibleTranslation?.id)}
              verse-reference=${ifDefined(this.selectedBibleVerse?.reference)}
              verse-content=${ifDefined(this.selectedBibleVerse?.content)}
              recited-bible-verse=${ifDefined(this.recitedBibleVerse)}
            ></score-page>
          `,
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

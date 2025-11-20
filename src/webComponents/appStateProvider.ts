import { LitElement, css, html, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";
import { Router } from "@lit-labs/router";

// use polyfill for URLPattern support in older browsers
import "urlpattern-polyfill";

import { CUSTOM_EVENTS, PAGE_URLS } from "../constants";
import { findBibleTranslationById } from "../data/bibleTranslationModel";

import type {
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
  selectedBibleId?: string;

  @state()
  selectedBibleVerse?: BibleVerse;

  @state()
  recitedBibleVerse?: string;

  static styles = css`
    *,
    ::before,
    ::after {
      box-sizing: border-box;
    }
  `;

  router = new Router(this, [
    {
      path: PAGE_URLS.INSTRUCTIONS_PAGE,
      render: () => {
        return html`<instructions-page></instructions-page>`;
      },
    },
    {
      path: PAGE_URLS.INSTRUCTIONS_PAGE,
      render: () => {
        return html`<instructions-page></instructions-page>`;
      },
    },
    {
      path: PAGE_URLS.SEARCH_OPTIONS_PAGE,
      render: () => html`<search-options-page></search-options-page>`,
    },
    {
      path: PAGE_URLS.SEARCH_VERSE_OF_THE_DAY_PAGE,
      render: () =>
        html`<search-verse-of-the-day-page
          bible-id=${this.selectedBibleId}
        ></search-verse-of-the-day-page>`,
    },
    {
      path: PAGE_URLS.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
      render: () =>
        html`<search-verses-for-sharing-the-gospel-page
          bible-id=${this.selectedBibleId}
        ></search-verses-for-sharing-the-gospel-page>`,
    },
    {
      path: PAGE_URLS.SEARCH_PSALM_23_PAGE,
      render: () =>
        html`<search-psalm-23-page
          bible-id=${this.selectedBibleId}
        ></search-psalm-23-page>`,
    },
    {
      path: PAGE_URLS.SEARCH_VERSES_FOR_AWANA_PAGE,
      render: () =>
        html`<search-verses-for-awana-page
          bible-id=${this.selectedBibleId}
        ></search-verses-for-awana-page>`,
    },
    {
      path: PAGE_URLS.SEARCH_ADVANCED_PAGE,
      render: () =>
        html`<search-advanced-page
          bible-id=${this.selectedBibleId}
        ></search-advanced-page>`,
    },
    {
      path: PAGE_URLS.SPEAK_VERSE_FROM_MEMORY_PAGE,
      render: () =>
        html`<speak-verse-from-memory-page
          verse-reference=${this.selectedBibleVerse?.reference || nothing}
          verse-content=${this.selectedBibleVerse?.content || nothing}
        ></speak-verse-from-memory-page>`,
    },
    {
      path: PAGE_URLS.TYPE_VERSE_FROM_MEMORY_PAGE,
      render: () =>
        html`<type-verse-from-memory-page
          verse-reference=${this.selectedBibleVerse?.reference || nothing}
        ></type-verse-from-memory-page>`,
    },
    {
      path: PAGE_URLS.SCORE_PAGE,
      render: () =>
        html`<score-page
          bible-id=${this.selectedBibleId}
          verse-reference=${this.selectedBibleVerse?.reference || nothing}
          verse-content=${this.selectedBibleVerse?.content || nothing}
          recited-bible-verse=${this.recitedBibleVerse || nothing}
        ></score-page>`,
    },
    {
      path: "(.*)",
      render: () => {
        return html`<instructions-page></instructions-page>`;
      },
    },
  ]);

  constructor() {
    super();

    window.history.scrollRestoration = "manual";

    this.addEventListener(
      CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
      (event: CustomEventInit<CustomEventNavigateToPage>) => {
        const pageNavigation = event.detail?.pageNavigation;
        if (pageNavigation) {
          this.#viewTransitionForPageNavigation(pageNavigation);
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
      (event: CustomEventInit<CustomEventUpdateBibleTranslation>) => {
        const bibleTranslation = event.detail?.bibleTranslation;
        if (bibleTranslation) {
          this.selectedBibleId = bibleTranslation.id;
          history.replaceState({}, "", this.#getURLWithQueryParams());
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateBibleVerse>) => {
        const bibleVerse = event.detail?.bibleVerse;
        if (bibleVerse) {
          this.selectedBibleVerse = bibleVerse;
          history.replaceState({}, "", this.#getURLWithQueryParams());
        }
      },
    );

    this.addEventListener(
      CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventUpdateRecitedBibleVerse>) => {
        const recitedBibleVerse = event.detail?.recitedBibleVerse;
        if (recitedBibleVerse) {
          this.recitedBibleVerse = recitedBibleVerse;
        }
      },
    );
  }

  render() {
    return html`${this.router.outlet()}`;
  }

  #viewTransitionForPageNavigation(pageNavigation: PageNavigation) {
    history.pushState(
      {},
      "",
      this.#getURLWithQueryParams(pageNavigation.nextPage),
    );

    // fallback for browsers that don't support the View Transition API
    if (!document.startViewTransition) {
      this.router.goto(pageNavigation.nextPage);
      window.scrollTo(0, 0);
      return;
    }

    // View Transition API
    const transition = document.startViewTransition(() => {
      this.router.goto(pageNavigation.nextPage);
    });

    transition.ready.then(() => {
      // scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  #getURLWithQueryParams(pathname = window.location.pathname) {
    const url = new URL(pathname, window.location.origin);
    if (this.selectedBibleId) {
      const { abbreviationLocal } = findBibleTranslationById(
        this.selectedBibleId,
      );
      url.searchParams.set("translation", abbreviationLocal);
    }

    if (this.selectedBibleVerse) {
      url.searchParams.set("verse", this.selectedBibleVerse.reference);
    }

    return url;
  }
}

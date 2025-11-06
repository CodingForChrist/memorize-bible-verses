import { CUSTOM_EVENTS } from "../constants";

import type { CustomEventSearchForBibleVerse } from "../types";

export class BibleVerseAdvancedSearch extends HTMLElement {
  #selectedVerseReference?: string;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElements);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["is-visible", "bible-id"];
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get selectedVerseReference() {
    return this.#selectedVerseReference ?? "";
  }

  set selectedVerseReference(value: string) {
    this.#selectedVerseReference = value;

    this.#bibleVerseFetchResultElement.setAttribute("verse-reference", value);
  }

  get #bibleVerseFetchResultElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-fetch-result",
    ) as HTMLElement;
  }

  get #searchFormContainerElement() {
    return this.shadowRoot!.querySelector(
      "#search-form-container",
    ) as HTMLDivElement;
  }

  #renderSearchForm() {
    this.#searchFormContainerElement.innerHTML = "";
    const searchFormElement = document.createElement("bible-verse-search-form");
    searchFormElement.setAttribute(
      "verse-reference",
      this.selectedVerseReference,
    );
    this.#searchFormContainerElement.appendChild(searchFormElement);

    window.addEventListener(
      CUSTOM_EVENTS.SEARCH_FOR_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventSearchForBibleVerse>) => {
        const verseReference = event.detail?.verseReference;
        if (verseReference) {
          this.selectedVerseReference = verseReference;
        }
      },
    );
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <div id="search-form-container"></div>
      <bible-verse-fetch-result></bible-verse-fetch-result>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
    :host {
      display: block;
    }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "bible-id" && newValue && oldValue !== newValue) {
      this.#renderSearchForm();
    }

    for (const attributeName of BibleVerseAdvancedSearch.observedAttributes) {
      if (name === attributeName) {
        this.#bibleVerseFetchResultElement?.setAttribute(
          attributeName,
          newValue,
        );
      }
    }
  }
}

window.customElements.define(
  "bible-verse-advanced-search",
  BibleVerseAdvancedSearch,
);

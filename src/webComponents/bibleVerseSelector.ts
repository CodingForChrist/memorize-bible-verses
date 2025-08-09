import { removeExtraContentFromBibleVerse } from "../formatBibleVerseFromApi";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_SCRIPTURE_API_BASE_URL,
  type LoadingStates,
} from "../constants";
import { buttonStyles, scriptureStyles } from "../sharedStyles";

import type {
  BibleVerse,
  CustomEventUpdateBibleVerse,
  CustomEventSearchForBibleVerse,
} from "../types";

export class BibleVerseSelector extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElements);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["loading-state", "bible-id"];
  }

  get selectedBibleVerse(): BibleVerse | undefined {
    return this.#selectedBibleVerse;
  }

  set selectedBibleVerse(value: BibleVerse) {
    this.#selectedBibleVerse = {
      ...value,
      content: removeExtraContentFromBibleVerse(value.content),
    };
    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventUpdateBibleVerse>(
        CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
        {
          detail: { bibleVerse: this.#selectedBibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBible);
  }

  get loadingState() {
    return this.getAttribute("loading-state") as LoadingStates;
  }

  set loadingState(value: LoadingStates) {
    if (value === LOADING_STATES.PENDING) {
      this.#showLoadingSpinner();
    } else {
      this.#hideLoadingSpinner();
    }

    this.setAttribute("loading-state", value);
  }

  #showLoadingSpinner() {
    const loadingSpinnerElement = document.createElement("loading-spinner");
    this.#searchResultsContainerElement.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    this.#searchResultsContainerElement
      .querySelector("loading-spinner")
      ?.remove();
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get #searchFormContainerElement() {
    return this.shadowRoot!.querySelector(
      "#search-form-container",
    ) as HTMLDivElement;
  }

  get #searchResultsContainerElement() {
    return this.shadowRoot!.querySelector(
      "#search-results-container",
    ) as HTMLDivElement;
  }

  #renderSearchForm() {
    this.#searchFormContainerElement.innerHTML = "";
    this.#searchResultsContainerElement.innerHTML = "";

    const bibleVerseReference = this.#selectedBibleVerse?.reference ?? "";
    const searchFormElement = document.createElement("bible-verse-search-form");
    searchFormElement.setAttribute(
      "bible-verse-reference",
      bibleVerseReference,
    );

    window.addEventListener(
      CUSTOM_EVENTS.SEARCH_FOR_BIBLE_VERSE,
      (event: CustomEventInit<CustomEventSearchForBibleVerse>) => {
        if (this.loadingState === LOADING_STATES.PENDING) {
          return;
        }
        const bibleVerseReference = event.detail?.bibleVerseReference;
        if (bibleVerseReference) {
          this.#searchResultsContainerElement.innerHTML = "";
          this.#searchForVerse(bibleVerseReference);
        }
      },
    );

    this.#searchFormContainerElement.appendChild(searchFormElement);
  }

  #renderSelectedBibleVerse() {
    this.#searchResultsContainerElement.innerHTML = "";

    const bibleVerseBlockquoteElement = document.createElement(
      "bible-verse-blockquote",
    );
    bibleVerseBlockquoteElement.innerHTML = `
      <span class="scripture-styles" slot="bible-verse-content">
        ${this.selectedBibleVerse!.content}
      </span>
    `;

    this.#searchResultsContainerElement.append(bibleVerseBlockquoteElement);
  }

  async #searchForVerse(query: string) {
    if (!this.bibleId) {
      return;
    }

    try {
      this.loadingState = LOADING_STATES.PENDING;

      const response = await fetch(
        `${MEMORIZE_SCRIPTURE_API_BASE_URL}/api/v1/bibles/${this.bibleId}/search/verse-reference`,
        {
          method: "POST",
          body: JSON.stringify({
            query,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_scripture_web_app",
          },
        },
      );
      const json = await response.json();

      if (response.ok && json.data && json.data?.passages.length === 1) {
        const { id, reference, content } = json.data.passages[0] as BibleVerse;
        this.selectedBibleVerse = { id, reference, content };
        this.loadingState = LOADING_STATES.RESOLVED;
        this.#renderTrackingPixel(json.meta.fumsId);
      } else {
        throw new Error("Failed to find the verse");
      }
    } catch (_error) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderErrorMessage(message: string) {
    this.#searchResultsContainerElement.innerHTML = "";
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;
    this.#searchResultsContainerElement.appendChild(alertErrorElement);
  }

  #renderTrackingPixel(fumsId: string) {
    const imageElement = document.createElement("img");
    imageElement.width = 1;
    imageElement.height = 1;
    imageElement.style.width = "0";
    imageElement.style.height = "0";
    imageElement.src = `https://d3btgtzu3ctdwx.cloudfront.net/nf1?t=${fumsId}`;

    this.#searchResultsContainerElement.appendChild(imageElement);
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <div id="search-form-container"></div>
      <div id="search-results-container"></div>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
    :host {
      display: block;
    }
    bible-verse-blockquote {
      margin: 2rem 0;
    }
    alert-error {
      margin-top: 2rem;
    }
    p {
      margin: 1rem 0;
    }
    ${buttonStyles}
    ${scriptureStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  attributeChangedCallback(name: string) {
    if (name === "bible-id") {
      return this.#renderSearchForm();
    }
    if (
      name === "loading-state" &&
      this.loadingState === LOADING_STATES.RESOLVED
    ) {
      return this.#renderSelectedBibleVerse();
    }
    if (
      name === "loading-state" &&
      this.loadingState === LOADING_STATES.REJECTED
    ) {
      return this.#renderErrorMessage(
        "Failed to find the bible verse reference. Please try another search.",
      );
    }
  }
}

window.customElements.define("bible-verse-selector", BibleVerseSelector);

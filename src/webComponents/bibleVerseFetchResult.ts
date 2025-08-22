import { removeExtraContentFromBibleVerse } from "../formatBibleVerseFromApi";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_SCRIPTURE_API_BASE_URL,
  type LoadingStates,
} from "../constants";
import { scriptureStyles } from "../sharedStyles";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../types";

export class BibleVerseFetchResult extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["loading-state", "bible-id", "verse-reference"];
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get shouldDisplaySectionHeadings() {
    return this.getAttribute("should-display-section-headings") === "true";
  }

  get #bibleVerseBlockquoteElement() {
    return this.shadowRoot!.querySelector("bible-verse-blockquote");
  }

  get selectedBibleVerse(): BibleVerse | undefined {
    return this.#selectedBibleVerse;
  }

  set selectedBibleVerse(value: BibleVerse) {
    this.#selectedBibleVerse = {
      ...value,
      content: this.#formatBibleVerse(value),
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
    this.shadowRoot!.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    this.shadowRoot!.querySelector("loading-spinner")?.remove();
  }

  #formatBibleVerse(bibleVerse: BibleVerse) {
    const options = {
      shouldRemoveSectionHeadings: !this.shouldDisplaySectionHeadings,
      shouldRemoveFootnotes: true,
      shouldRemoveVerseNumbers: bibleVerse.verseCount < 2,
      shouldTrimParagraphBreaks: true,
    };

    return removeExtraContentFromBibleVerse(bibleVerse.content, options);
  }

  #clearSelectedBibleVerse() {
    this.#selectedBibleVerse = undefined;
  }

  #renderSelectedBibleVerse() {
    this.#bibleVerseBlockquoteElement?.remove();

    const bibleVerseBlockquoteElement = document.createElement(
      "bible-verse-blockquote",
    );
    bibleVerseBlockquoteElement.innerHTML = `
      <span class="scripture-styles" slot="bible-verse-content">
        ${this.selectedBibleVerse!.content}
      </span>
    `;

    this.shadowRoot!.append(bibleVerseBlockquoteElement);
  }

  async #fetchVerseReference() {
    if (!this.bibleId || !this.verseReference) {
      return;
    }

    try {
      this.loadingState = LOADING_STATES.PENDING;

      const response = await fetch(
        `${MEMORIZE_SCRIPTURE_API_BASE_URL}/api/v1/bibles/${this.bibleId}/search/verse-reference`,
        {
          method: "POST",
          body: JSON.stringify({
            query: this.verseReference,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_scripture_web_app",
          },
        },
      );
      const json = await response.json();

      if (response.ok && json.data && json.data?.passages.length === 1) {
        const { id, reference, content, verseCount } = json.data
          .passages[0] as BibleVerse;
        this.selectedBibleVerse = { id, reference, content, verseCount };
        this.loadingState = LOADING_STATES.RESOLVED;
        // this.#renderTrackingPixel(json.meta.fumsToken);
      } else {
        throw new Error("Failed to find the verse");
      }
    } catch (_error) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderErrorMessage(message: string) {
    this.#bibleVerseBlockquoteElement?.remove();
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;
    this.shadowRoot!.appendChild(alertErrorElement);
  }

  // TODO: figure out the correct way to use this
  // #renderTrackingPixel(fumsToken: string) {
  //   const imageElement = document.createElement("img");
  //   imageElement.width = 1;
  //   imageElement.height = 1;
  //   imageElement.style.width = "0";
  //   imageElement.style.height = "0";
  //   imageElement.src = `https://d3btgtzu3ctdwx.cloudfront.net/nf1?t=${fumsToken}`;

  //   this.shadowRoot!.appendChild(imageElement);
  // }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
    :host {
      display: block;
    }
    alert-error {
      margin-top: 2rem;
    }
    bible-verse-blockquote {
      margin: 3rem 0 2rem;
    }
    ${scriptureStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  async connectedCallback() {
    await this.#fetchVerseReference();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.loadingState === LOADING_STATES.PENDING) {
      // ignore changes while fetch call is pending
      return;
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

    if (name === "verse-reference" && !newValue) {
      this.#bibleVerseBlockquoteElement?.remove();
      return this.#clearSelectedBibleVerse();
    }

    if (name === "verse-reference" && oldValue !== newValue) {
      this.#bibleVerseBlockquoteElement?.remove();
      return this.#fetchVerseReference();
    }

    if (name === "bible-id" && oldValue !== newValue) {
      this.#bibleVerseBlockquoteElement?.remove();
      return this.#fetchVerseReference();
    }
  }
}

window.customElements.define("bible-verse-fetch-result", BibleVerseFetchResult);

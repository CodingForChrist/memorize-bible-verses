import { removeExtraContentFromBibleVerse } from "../formatBibleVerseFromApi";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_SCRIPTURE_API_BASE_URL,
  type LoadingStates,
} from "../constants";
import { scriptureStyles } from "../sharedStyles";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../types";

export class BibleVerseDropDownList extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElements);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["loading-state", "bible-id", "verses"];
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get verses() {
    return this.getAttribute("verses")?.split(",");
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
    this.#resultsContainerElement.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    this.#resultsContainerElement.querySelector("loading-spinner")?.remove();
  }

  #clearSelectedBibleVerse() {
    this.#selectedBibleVerse = undefined;
  }

  get #selectContainerElement() {
    return this.shadowRoot!.querySelector(
      "#select-container",
    ) as HTMLDivElement;
  }

  get #resultsContainerElement() {
    return this.shadowRoot!.querySelector(
      "#results-container",
    ) as HTMLDivElement;
  }

  #renderSelectedBibleVerse() {
    this.#resultsContainerElement.innerHTML = "";

    const bibleVerseBlockquoteElement = document.createElement(
      "bible-verse-blockquote",
    );
    bibleVerseBlockquoteElement.innerHTML = `
      <span class="scripture-styles" slot="bible-verse-content">
        ${this.selectedBibleVerse!.content}
      </span>
    `;

    this.#resultsContainerElement.append(bibleVerseBlockquoteElement);
  }

  #renderSelect() {
    if (!this.verses) {
      return;
    }

    this.#selectContainerElement.innerHTML = "";
    this.#resultsContainerElement.innerHTML = "";

    const divContainerElement = document.createElement("div");
    divContainerElement.innerHTML = `
      <select name="select-verse" autofocus>
      <option disabled selected value> -- select a verse -- </option>
      ${this.verses.map(
        (verse) => `<option value="${verse}">${verse}</option>`,
      )}
      </select>
      `;
    const selectElement = divContainerElement.querySelector(
      'select[name="select-verse"]',
    ) as HTMLSelectElement;

    selectElement.onchange = async () => {
      this.#resultsContainerElement.innerHTML = "";
      await this.#searchForVerse(selectElement.value);
    };

    if (this.selectedBibleVerse?.reference) {
      if (this.selectedBibleVerse.reference.startsWith("Psalms")) {
        const psalmVerseReference = this.selectedBibleVerse.reference.replace(
          "Psalms",
          "Psalm",
        );
        selectElement.value = psalmVerseReference;
      } else {
        selectElement.value = this.selectedBibleVerse.reference;
      }
      selectElement.dispatchEvent(new Event("change"));
    }

    this.#selectContainerElement.appendChild(divContainerElement);
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
    this.#resultsContainerElement.innerHTML = "";
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;
    this.#resultsContainerElement.appendChild(alertErrorElement);
  }

  #renderTrackingPixel(fumsId: string) {
    const imageElement = document.createElement("img");
    imageElement.width = 1;
    imageElement.height = 1;
    imageElement.style.width = "0";
    imageElement.style.height = "0";
    imageElement.src = `https://d3btgtzu3ctdwx.cloudfront.net/nf1?t=${fumsId}`;

    this.#resultsContainerElement.appendChild(imageElement);
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <div id="select-container"></div>
      <div id="results-container"></div>
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
      margin: 4rem 0;
    }
    alert-error {
      margin-top: 2rem;
    }
    p {
      margin: 1rem 0;
    }
    select {
      font: inherit;
      color: inherit;
      line-height: 1.5rem;
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.5rem 2.5rem 0.5rem 0.75rem;
      background-color: var(--color-primary-mint-cream);
      border: 1px solid var(--color-light-gray);
      border-radius: 1.5rem;
      print-color-adjust: exact;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
    }
    select:focus {
      border-color: var(--color-primary-mint-cream);
      outline: 1px solid var(--color-gray);
    }
    ${scriptureStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "bible-id" && oldValue !== newValue) {
      return this.#renderSelect();
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
      this.#clearSelectedBibleVerse();
    }
  }
}

window.customElements.define(
  "bible-verse-drop-down-list",
  BibleVerseDropDownList,
);

import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_SCRIPTURE_API_BASE_URL,
  type LoadingStates,
} from "../constants";

import type { BibleTranslation } from "../types";

const supportedBibles = [
  {
    id: "bba9f40183526463-01",
    abbreviationLocal: "BSB",
  },
  {
    id: "de4e12af7f28f599-02",
    abbreviationLocal: "KJV",
  },
  {
    id: "06125adad2d5898a-01",
    abbreviationLocal: "ASV",
  },
  {
    id: "9879dbb7cfe39e4d-04",
    abbreviationLocal: "WEB",
  },
];

// default to BSB
const defaultBible = supportedBibles[0];

export class BibleTranslationSelector extends HTMLElement {
  #selectedBibleTranslation?: BibleTranslation;
  bibleTranslations: BibleTranslation[];

  constructor() {
    super();

    this.bibleTranslations = [];

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["loading-state"];
  }

  get selectedBibleTranslation(): BibleTranslation | undefined {
    return this.#selectedBibleTranslation;
  }

  set selectedBibleTranslation(value: BibleTranslation) {
    this.#selectedBibleTranslation = value;
    const eventUpdateSelectedBibleTranslation = new CustomEvent(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_TRANSLATION,
      {
        detail: { selectedBibleTranslation: value },
        bubbles: true,
        composed: true,
      },
    );
    window.dispatchEvent(eventUpdateSelectedBibleTranslation);
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

  async #fetchBibles() {
    try {
      this.loadingState = LOADING_STATES.PENDING;
      const response = await fetch(
        `${MEMORIZE_SCRIPTURE_API_BASE_URL}/api/v1/bibles`,
        {
          method: "POST",
          body: JSON.stringify({
            language: "eng",
            ids: supportedBibles.map(({ id }) => id).toString(),
            includeFullDetails: true,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_scripture_web_app",
          },
        },
      );
      const json = await response.json();
      this.bibleTranslations = json.data;
      if (response.ok && this.bibleTranslations.length) {
        this.loadingState = LOADING_STATES.RESOLVED;
      } else {
        throw new Error("Failed to load Bibles");
      }
    } catch (_error) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderSelectElement() {
    const divContainerElement = document.createElement("div");
    divContainerElement.innerHTML = `
      <label>
        <span>Select a bible translation</span>
        <select name="select-bible-translation">
        ${this.bibleTranslations.map(({ id, name, abbreviationLocal }) => `<option value="${id}">${name} (${abbreviationLocal})</option>`)}
        </select>
      </label>
      `;
    const selectElement = divContainerElement.querySelector(
      'select[name="select-bible-translation"]',
    ) as HTMLSelectElement;

    selectElement.value = defaultBible.id;
    this.selectedBibleTranslation = this.#findBibleTranslationById(
      defaultBible.id,
    );

    selectElement.onchange = () => {
      this.selectedBibleTranslation = this.#findBibleTranslationById(
        selectElement.value,
      );
    };

    this.shadowRoot!.appendChild(divContainerElement);
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const colorGray100 = "oklch(96.7% .003 264.542)";
    const colorGray500 = "oklch(55.1% .027 264.364)";
    const colorGray700 = "oklch(37.3% .034 259.733)";
    const colorWhite = "#fff";

    const css = `
      :host {
        display: block;
      }
      label {
        display: block;
      }
      label span {
        color: ${colorGray700};
      }
      select {
        font: inherit;
        color: inherit;
        font-size: 1rem;
        line-height: 1.5rem;
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        padding: 0.5rem 2.5rem 0.5rem 0.75rem;
        background-color: ${colorGray100};
        border: 1px solid transparent;
        border-radius: 0;
        print-color-adjust: exact;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
      }
      select:focus {
        background-color: ${colorWhite};
        border-color: ${colorGray500};
        outline: 2px solid #0000;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  #findBibleTranslationById(bibleId: string) {
    const bibleTranslation = this.bibleTranslations.find(
      (bibleTranslation) => bibleTranslation.id === bibleId,
    );
    if (!bibleTranslation) {
      throw new Error("Failed to find the bible translation by id");
    }
    return bibleTranslation;
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = document.createElement("alert-error");
    alertErrorElement.innerHTML = `
      <span slot="alert-error-message">${message}</span>
    `;
    this.shadowRoot!.appendChild(alertErrorElement);
  }

  async connectedCallback() {
    await this.#fetchBibles();
  }

  attributeChangedCallback(name: string) {
    if (name !== "loading-state") {
      return;
    }

    // wait for bibles to finish loading before rendering
    if (this.loadingState === LOADING_STATES.RESOLVED) {
      return this.#renderSelectElement();
    }
    if (this.loadingState === LOADING_STATES.REJECTED) {
      return this.#renderErrorMessage(
        "Failed to load Bibles. Please try again later.",
      );
    }
  }
}

window.customElements.define(
  "bible-translation-selector",
  BibleTranslationSelector,
);

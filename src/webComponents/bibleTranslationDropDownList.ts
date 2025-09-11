import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_BIBLE_VERSES_API_BASE_URL,
  type LoadingStates,
} from "../constants";

import type {
  BibleTranslation,
  CustomEventUpdateBibleTranslation,
} from "../types";

const supportedBibles = [
  {
    id: "b8ee27bcd1cae43a-01",
    label: "NASB 1995 (New American Standard Bible)",
  },
  {
    id: "a761ca71e0b3ddcf-01",
    label: "NASB 2020 (New American Standard Bible)",
  },
  {
    id: "bba9f40183526463-01",
    label: "BSB (Berean Standard Bible)",
  },
  {
    id: "de4e12af7f28f599-02",
    label: "KJV (King James Version)",
  },
  {
    id: "06125adad2d5898a-01",
    label: "ASV (American Standard Version)",
  },
  {
    id: "9879dbb7cfe39e4d-04",
    label: "WEB (World English Bible)",
  },
];

// default to NASB 1995
const defaultBible = supportedBibles[0];

export class BibleTranslationDropDownList extends HTMLElement {
  #selectedBibleTranslation?: BibleTranslation;
  static bibleTranslations: BibleTranslation[] = [];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["is-visible", "loading-state", "bible-id"];
  }

  get selectedBibleTranslation(): BibleTranslation | undefined {
    return this.#selectedBibleTranslation;
  }

  set selectedBibleTranslation(value: BibleTranslation) {
    this.#selectedBibleTranslation = value;
    const eventUpdateSelectedBibleTranslation =
      new CustomEvent<CustomEventUpdateBibleTranslation>(
        CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
        {
          detail: { bibleTranslation: value },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBibleTranslation);
  }

  get isVisible() {
    return this.getAttribute("is-visible") === "true";
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

  get #bibleTranslationSelectElement() {
    return this.shadowRoot!.querySelector("select") as HTMLSelectElement;
  }

  async #fetchBibles() {
    // avoid making a fetch call when results are already loaded
    if (BibleTranslationDropDownList.bibleTranslations.length) {
      this.loadingState = LOADING_STATES.RESOLVED;
      return;
    }

    try {
      this.loadingState = LOADING_STATES.PENDING;
      const response = await fetch(
        `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles`,
        {
          method: "POST",
          body: JSON.stringify({
            language: "eng",
            ids: supportedBibles.map(({ id }) => id).toString(),
            includeFullDetails: true,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_bible_verses_web_app",
          },
        },
      );
      const json = await response.json();
      if (response.ok && json.data.length) {
        BibleTranslationDropDownList.bibleTranslations = json.data;
        this.loadingState = LOADING_STATES.RESOLVED;
      } else {
        throw new Error("Failed to load Bibles");
      }
    } catch (_error) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #getSelectOptionText(id: string) {
    const supportedBible = supportedBibles.find(
      (supportedBible) => supportedBible.id === id,
    );
    if (!supportedBible) {
      throw new Error("Failed to find the supported bible by id");
    }
    return supportedBible.label;
  }

  #renderSelectElement() {
    const divContainerElement = document.createElement("div");
    divContainerElement.innerHTML = `
      <select name="select-bible-translation">
      ${BibleTranslationDropDownList.bibleTranslations.map(
        ({ id }) =>
          `<option value="${id}">${this.#getSelectOptionText(id)}</option>`,
      )}
      </select>
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
    const css = `
      :host {
        display: block;
      }
      select {
        font: inherit;
        color: inherit;
        line-height: 1.5rem;
        display: block;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: var(--color-primary-mint-cream);
        border: 0;
        print-color-adjust: exact;
        appearance: none;
      }
      select:focus {
        padding: 0.5rem 2.5rem 0.5rem 0.75rem;
        border: 1px solid var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        outline: 1px solid var(--color-gray);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='oklch(55.1%25 0.027 264.364)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  #findBibleTranslationById(bibleId: string) {
    const bibleTranslation =
      BibleTranslationDropDownList.bibleTranslations.find(
        (bibleTranslation) => bibleTranslation.id === bibleId,
      );
    if (!bibleTranslation) {
      throw new Error("Failed to find the bible translation by id");
    }
    return bibleTranslation;
  }

  #renderErrorMessage(message: string) {
    // remove existing alert message
    this.shadowRoot!.querySelector('alert-message[type="danger"]')?.remove();

    const alertMessageElement = document.createElement("alert-message");
    alertMessageElement.setAttribute("type", "danger");
    alertMessageElement.innerHTML = `
      <span slot="alert-message">${message}</span>
    `;
    this.shadowRoot!.appendChild(alertMessageElement);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (
      name === "is-visible" &&
      newValue === "true" &&
      !this.#bibleTranslationSelectElement
    ) {
      return this.#fetchBibles();
    }
    if (
      name === "bible-id" &&
      this.#bibleTranslationSelectElement &&
      oldValue !== newValue
    ) {
      return (this.#bibleTranslationSelectElement.value = newValue);
    }

    // wait for bibles to finish loading before rendering
    if (
      name === "loading-state" &&
      this.loadingState === LOADING_STATES.RESOLVED
    ) {
      return this.#renderSelectElement();
    }
    if (
      name === "loading-state" &&
      this.loadingState === LOADING_STATES.REJECTED
    ) {
      return this.#renderErrorMessage(
        "Failed to load Bibles. Please try again later.",
      );
    }
  }
}

window.customElements.define(
  "bible-translation-drop-down-list",
  BibleTranslationDropDownList,
);

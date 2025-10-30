import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_BIBLE_VERSES_API_BASE_URL,
  type LoadingStates,
} from "../constants";

import { router } from "../services/router";

import localBibleTranslations from "../data/bibleTranslations.json";

import type {
  BibleTranslation,
  CustomEventUpdateBibleTranslation,
} from "../types";

export class BibleTranslationDropDownList extends HTMLElement {
  selectedBibleTranslation?: BibleTranslation;
  static bibleTranslations: BibleTranslation[] = [];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["is-visible", "loading-state", "bible-id"];
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
    return this.shadowRoot!.querySelector<HTMLSelectElement>("select");
  }

  #sendEventForSelectedBibleTranslation() {
    if (!this.selectedBibleTranslation) {
      return;
    }
    const eventUpdateSelectedBibleTranslation =
      new CustomEvent<CustomEventUpdateBibleTranslation>(
        CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
        {
          detail: { bibleTranslation: this.selectedBibleTranslation },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBibleTranslation);
  }

  #findBibleTranslationByAbbreviationLocal(abbreviationLocal: string) {
    const bibleTranslation =
      BibleTranslationDropDownList.bibleTranslations.find(
        (bibleTranslation) =>
          bibleTranslation.abbreviationLocal === abbreviationLocal,
      );
    if (!bibleTranslation) {
      throw new Error(
        "Failed to find the bible translation by abbreviationLocal",
      );
    }
    return bibleTranslation;
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

  #setDefaultBibleTranslation() {
    const bibleIdAttribute = this.getAttribute("bible-id");
    if (bibleIdAttribute) {
      this.selectedBibleTranslation =
        this.#findBibleTranslationById(bibleIdAttribute);
    } else {
      const bibleTranslationFromQueryString =
        router.getParam("translation") || "NKJV";
      this.selectedBibleTranslation =
        this.#findBibleTranslationByAbbreviationLocal(
          bibleTranslationFromQueryString,
        );
      this.#sendEventForSelectedBibleTranslation();
    }
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
            ids: localBibleTranslations.map(({ id }) => id).toString(),
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

  #getSortedBibleTranslationsWithLabels() {
    const bibleTranslationsWithLabels =
      BibleTranslationDropDownList.bibleTranslations.map((bibleTranslation) => {
        const supportedBible = localBibleTranslations.find(
          ({ id }) => bibleTranslation.id === id,
        );
        if (!supportedBible) {
          throw new Error("Failed to find the supported bible by id");
        }
        return {
          ...bibleTranslation,
          label: supportedBible.label,
        };
      });
    return bibleTranslationsWithLabels.sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }

  #renderSelectElement() {
    this.#setDefaultBibleTranslation();

    const selectElement = document.createElement("select");
    selectElement.name = "select-bible-translation";

    for (const { id, label } of this.#getSortedBibleTranslationsWithLabels()) {
      const optionElement = document.createElement("option");
      optionElement.value = id;
      optionElement.textContent = label;
      if (label.length > 36) {
        optionElement.classList.add("label-long");
      }
      selectElement.appendChild(optionElement);
    }

    selectElement.value = this.selectedBibleTranslation!.id;

    selectElement.onchange = () => {
      this.selectedBibleTranslation = this.#findBibleTranslationById(
        selectElement.value,
      );
      this.#sendEventForSelectedBibleTranslation();
    };

    this.shadowRoot!.appendChild(selectElement);
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
        padding: 0.5rem 2rem 0.5rem 0.75rem;
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
      select:has(option.label-long:checked) {
        font-size: 80%;

        @media (width >= 24rem) {
          font-size: 85%;
        }
        @media (width >= 28rem) {
          font-size: 90%;
        }
        @media (width >= 32rem) {
          font-size: 100%;
        }
      }
    `;
    styleElement.textContent = css;
    return styleElement;
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
      this.selectedBibleTranslation = this.#findBibleTranslationById(newValue);
      this.#bibleTranslationSelectElement.value = newValue;
      return;
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

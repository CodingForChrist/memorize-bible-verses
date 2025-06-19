import { getTemplate } from "./utils";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
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
  #selectedBibleId?: string;
  bibleTranslations: BibleTranslation[];
  #templates: {
    loadingSpinner: DocumentFragment;
    alertError: DocumentFragment;
  };

  constructor() {
    super();

    this.bibleTranslations = [];

    this.#templates = {
      loadingSpinner: getTemplate("loading-spinner-template"),
      alertError: getTemplate("alert-error-template"),
    };
  }

  static get observedAttributes() {
    return ["loading-state"];
  }

  get selectedBibleId(): string | undefined {
    return this.#selectedBibleId;
  }

  set selectedBibleId(value: string) {
    this.#selectedBibleId = value;
    const eventUpdateSelectedBible = new CustomEvent(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_TRANSLATION,
      {
        detail: { selectedBibleId: value },
      },
    );
    window.dispatchEvent(eventUpdateSelectedBible);
  }

  get loadingState() {
    return this.getAttribute("loading-state") as LoadingStates;
  }

  set loadingState(value: LoadingStates) {
    if (value === LOADING_STATES.INITIAL || value === LOADING_STATES.PENDING) {
      this.#showLoadingSpinner();
    } else {
      this.#hideLoadingSpinner();
    }
    this.setAttribute("loading-state", value);
  }

  #showLoadingSpinner() {
    this.appendChild(this.#templates.loadingSpinner);
  }

  #hideLoadingSpinner() {
    const loadingSpinner = this.querySelector(
      '[data-template-id="loading-spinner"]',
    );
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
  }

  async #fetchBibles() {
    try {
      this.loadingState = LOADING_STATES.PENDING;
      const response = await fetch(
        "https://memorize-scripture-api-server.fly.dev/api/v1/bibles",
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
    } catch (err) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderSelectElement() {
    const formSelectId = "select-bible";

    const html = `
      <label class="block">
        <span class="text-gray-700">Select a bible translation</span>
        <select id="${formSelectId}" class="block w-full mt-1 bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0">
        </select>
      </label>
    `;

    const divContainer = document.createElement("div");

    divContainer.innerHTML = html;
    const selectElement = divContainer.querySelector(
      `#${formSelectId}`,
    ) as HTMLSelectElement;

    for (const { id, name, abbreviationLocal } of this.bibleTranslations) {
      const optionElement = document.createElement("option");
      (optionElement.textContent = `${name} (${abbreviationLocal})`),
        (optionElement.value = id);
      selectElement.appendChild(optionElement);
    }

    selectElement.value = defaultBible.id;
    this.selectedBibleId = defaultBible.id;

    selectElement.onchange = () => {
      this.selectedBibleId = selectElement.value;
    };

    this.appendChild(divContainer);
  }

  #renderErrorMessage(message: string) {
    const errorMessageSlot =
      this.#templates.alertError.querySelector<HTMLSlotElement>(
        'slot[name="error-message"]',
      );

    if (errorMessageSlot) {
      errorMessageSlot.innerText = message;
      this.append(this.#templates.alertError);
    }
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
      this.#renderSelectElement();
    } else if (this.loadingState === LOADING_STATES.REJECTED) {
      this.#renderErrorMessage(
        "Failed to load Bibles. Please try again later.",
      );
    }
  }
}

import { getTemplate } from "./utils";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  type LoadingStates,
} from "../constants";

import type { BibleVerse } from "../types";

export class BibleVerseSelector extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;

  static get observedAttributes() {
    return ["loading-state", "selected-bible-id"];
  }

  get selectedBibleVerse(): BibleVerse | undefined {
    return this.#selectedBibleVerse;
  }

  set selectedBibleVerse(value: BibleVerse) {
    this.#selectedBibleVerse = value;
    const eventUpdateSelectedBible = new CustomEvent(
      CUSTOM_EVENTS.UPDATE_SELECTED_BIBLE_VERSE,
      {
        detail: { selectedBibleVerse: value },
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
    this.appendChild(getTemplate("loading-spinner-template"));
  }

  #hideLoadingSpinner() {
    const loadingSpinner = this.querySelector(
      '[data-template-id="loading-spinner"]',
    );
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
  }

  get selectedBibleId() {
    return this.getAttribute("selected-bible-id");
  }

  #renderSearchForm() {
    const bibleVerseReference = this.#selectedBibleVerse?.reference ?? "";

    const html = `
      <label for="form-input-verse" class="block">
        <span class="text-gray-700">Enter a bible verse</span>
      </label>
      <div class="flex gap-1">
        <input type="text" id="form-input-verse" name="form-input-verse" class="flex-1 mt-1 w-full bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" autofocus placeholder="John 3:16" value="${bibleVerseReference}">
        </input>

        <button type="button" id="button-search" class="flex-none mt-1 z-1 bg-blue-600 px-4 py-2 text-sm/6 font-semibold text-white hover:bg-blue-800">Search</button>
      </div>
      <div id="verse-content"></div>
    `;

    const divContainer = document.createElement("div");
    divContainer.innerHTML = html;

    const buttonSearch = divContainer.querySelector(
      "#button-search",
    ) as HTMLButtonElement;
    const formInputVerse = divContainer.querySelector(
      "#form-input-verse",
    ) as HTMLInputElement;
    const verseContentElement = divContainer.querySelector(
      "#verse-content",
    ) as HTMLDivElement;

    buttonSearch.onclick = () => {
      verseContentElement.innerHTML = "";
      this.#searchForVerse(formInputVerse.value);
    };

    this.append(divContainer);
  }

  #renderSelectedBibleVerse() {
    const divContainer = document.createElement("div");
    divContainer.classList.add("scripture-styles", "my-8");

    divContainer.innerHTML = this.selectedBibleVerse!.content;

    const verseContentElement =
      this.querySelector<HTMLDivElement>("#verse-content");
    if (verseContentElement) {
      verseContentElement.innerHTML = "";
      verseContentElement.append(divContainer);
    }
  }

  async #searchForVerse(query: string) {
    try {
      this.loadingState = LOADING_STATES.PENDING;
      const selectedBibleId = this.selectedBibleId as string;

      const response = await fetch(
        `https://memorize-scripture-api-server.fly.dev/api/v1/bibles/${selectedBibleId}/search`,
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
      } else {
        throw new Error("Failed to find the verse");
      }
    } catch (err) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderErrorMessage(message: string) {
    const alertErrorElement = getTemplate("alert-error-template");
    const errorMessageSlot = alertErrorElement.querySelector<HTMLSlotElement>(
      'slot[name="error-message"]',
    );

    if (errorMessageSlot) {
      errorMessageSlot.innerText = message;
      const verseContentElement = this.querySelector(
        "#verse-content",
      ) as HTMLDivElement;
      verseContentElement.append(alertErrorElement);
    }
  }

  attributeChangedCallback(name: string) {
    if (name === "selected-bible-id") {
      this.innerHTML = "";
      this.#renderSearchForm();
    } else if (name === "loading-state") {
      if (this.loadingState === LOADING_STATES.RESOLVED) {
        this.#renderSelectedBibleVerse();
      } else if (this.loadingState === LOADING_STATES.REJECTED) {
        this.#renderErrorMessage(
          "Failed to find bible verse. Please try another search.",
        );
      }
    }
  }
}

window.customElements.define("bible-verse-selector", BibleVerseSelector);

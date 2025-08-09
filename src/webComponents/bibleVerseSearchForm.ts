import { CUSTOM_EVENTS } from "../constants";

import type { CustomEventSearchForBibleVerse } from "../types";

export class BibleVerseSearchForm extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(this.#searchForm);
  }

  static get observedAttributes() {
    return ["bible-verse-reference"];
  }

  get bibleVerseReference() {
    return this.getAttribute("bible-verse-reference") ?? "";
  }

  set bibleVerseReference(value: string) {
    this.setAttribute("bible-verse-reference", value);
  }

  get #searchForm() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <label for="input-bible-verse">
        <span>Enter a bible verse reference</span><br>
        <small>e.g. "John 1:1" or "John 3:16-21"</small>
      </label>
      <form class="search-form-container">
        <input type="text" name="input-bible-verse" required autofocus>
        <branded-button type="submit" text-content="Search"></branded-button>
      </form>
    `;

    if (this.bibleVerseReference) {
      divElement.querySelector("input")!.value = this.bibleVerseReference;
    }

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        display: block;
      }
      label {
        display: block;
      }
      label small {
        font-size: 0.75rem;
        line-height: calc(1.25 / 0.875);
      }
      .search-form-container {
        display: flex;
        gap: 0.25rem;
        margin-top: 0.25rem;
      }
      input {
        font: inherit;
        color: inherit;
        line-height: 1.5rem;
        flex: 1;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background-color: var(--color-primary-mint-cream);
        border: 1px solid var(--color-light-gray);
        border-radius: 1.5rem;
      }
      input:focus, input:active {
        border-color: var(--color-primary-mint-cream);
        outline: 1px solid var(--color-gray);
      }
      input:-webkit-autofill,
      input:-webkit-autofill:focus {
        transition: background-color 0s 600000s, color 0s 600000s !important;
      }
      branded-button {
        min-width: 5rem;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector("form")?.addEventListener(
      "submit",
      (event: Event) => {
        event.preventDefault();
        const inputElement = this.shadowRoot!.querySelector(
          'input[name="input-bible-verse"]',
        ) as HTMLInputElement;
        this.bibleVerseReference = inputElement.value;
        this.#dispatchSearchEvent();
      },
    );
  }

  #dispatchSearchEvent() {
    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventSearchForBibleVerse>(
        CUSTOM_EVENTS.SEARCH_FOR_BIBLE_VERSE,
        {
          detail: { bibleVerseReference: this.bibleVerseReference },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBible);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name !== "bible-verse-reference") {
      return;
    }
    const inputElement = this.shadowRoot!.querySelector(
      'input[name="input-bible-verse"]',
    ) as HTMLInputElement;
    inputElement.value = newValue;
  }
}

window.customElements.define("bible-verse-search-form", BibleVerseSearchForm);

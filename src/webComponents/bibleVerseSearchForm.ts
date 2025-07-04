import { buttonStyles } from "../sharedStyles";
import { CUSTOM_EVENTS } from "../constants";

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
      <div class="search-form-container">
        <input type="text" name="input-bible-verse"
          value="${this.bibleVerseReference}" autofocus />
        <button type="button" class="button-primary">Search</button>
      </div>
    `;

    return divElement;
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
        color: ${colorGray700};
      }
      label small {
        font-size: 0.875rem;
        line-height: calc(1.25 / 0.875);
      }
      .search-form-container {
        display: flex;
        gap: 0.25rem;
      }
      input {
        font: inherit;
        color: inherit;
        font-size: 1rem;
        line-height: 1.5rem;
        flex: 1;
        width: 100%;
        margin-top: 0.25rem;
        padding: 0.5rem 0.75rem;
        background-color: ${colorGray100};
        border: 1px solid transparent;
        border-radius: 0;
      }
      input:focus, input:active {
        background-color: ${colorWhite};
        border-color: ${colorGray500};
        outline: 2px solid #0000;
      }
      ${buttonStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector("button")?.addEventListener("click", () => {
      const inputElement = this.shadowRoot!.querySelector(
        'input[name="input-bible-verse"]',
      ) as HTMLInputElement;
      this.bibleVerseReference = inputElement.value;
      this.#dispatchSearchEvent();
    });
  }

  #dispatchSearchEvent() {
    const eventUpdateSelectedBible = new CustomEvent(
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

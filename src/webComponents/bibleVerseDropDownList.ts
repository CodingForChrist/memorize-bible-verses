import {
  getOldTestamentVerseReferences,
  getNewTestamentVerseReferences,
  sortBibleVerseReferences,
} from "../bibleVerseReferenceHelper";

export class BibleVerseDropDownList extends HTMLElement {
  #selectedVerseReference?: string;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElements);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["is-visible", "bible-id", "verses", "selected-verse"];
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get verses() {
    return this.getAttribute("verses")?.split(",");
  }

  get selectedVerseReference() {
    return this.#selectedVerseReference ?? "";
  }

  set selectedVerseReference(value: string) {
    this.#selectedVerseReference = value;

    this.#bibleVerseFetchResultElement.setAttribute("verse-reference", value);
  }

  #updateSelectedVerseFromAttribute() {
    const selectedVerseFromAttribute = this.getAttribute("selected-verse");
    if (!selectedVerseFromAttribute) {
      return;
    }

    const selectElement = this.#selectContainerElement.querySelector(
      'select[name="select-verse"]',
    ) as HTMLSelectElement;

    selectElement.value = selectedVerseFromAttribute;
    selectElement.dispatchEvent(new Event("change"));
  }

  get #selectContainerElement() {
    return this.shadowRoot!.querySelector(
      "#select-container",
    ) as HTMLDivElement;
  }

  get #bibleVerseFetchResultElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-fetch-result",
    ) as HTMLElement;
  }

  get #versesFromOldTestament() {
    if (!this.verses) {
      return [];
    }
    const oldTestamentVerses = getOldTestamentVerseReferences(this.verses);
    return sortBibleVerseReferences(oldTestamentVerses);
  }

  get #versesFromNewTestament() {
    if (!this.verses) {
      return [];
    }
    const newTestamentVerses = getNewTestamentVerseReferences(this.verses);
    return sortBibleVerseReferences(newTestamentVerses);
  }

  #renderSelect() {
    if (!this.verses) {
      return;
    }

    this.#selectContainerElement.innerHTML = "";

    const divContainerElement = document.createElement("div");
    divContainerElement.innerHTML = `
      <select name="select-verse" autofocus>
      <option disabled selected value> -- select a verse -- </option>
      <optgroup label="Old Testament">
      ${this.#versesFromOldTestament.map(
        (verse) => `<option value="${verse}">${verse}</option>`,
      )}
      </optgroup>
      <optgroup label="New Testament">
      ${this.#versesFromNewTestament.map(
        (verse) => `<option value="${verse}">${verse}</option>`,
      )}
      </select>
      `;
    const selectElement = divContainerElement.querySelector(
      'select[name="select-verse"]',
    ) as HTMLSelectElement;

    selectElement.onchange = () => {
      this.selectedVerseReference = selectElement.value;
    };

    if (this.selectedVerseReference) {
      selectElement.value = this.selectedVerseReference;
      selectElement.dispatchEvent(new Event("change"));
    }

    this.#selectContainerElement.appendChild(divContainerElement);
  }

  get #containerElements() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <div id="select-container"></div>
      <bible-verse-fetch-result></bible-verse-fetch-result>
    `;

    return divElement;
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
    bible-verse-fetch-result {
      margin-top: 3rem;
    }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "bible-id" && oldValue !== newValue) {
      this.#renderSelect();
    }

    for (const attributeName of ["is-visible", "bible-id"]) {
      if (name === attributeName) {
        this.#bibleVerseFetchResultElement.setAttribute(
          attributeName,
          newValue,
        );
      }
    }

    if (name === "selected-verse" && oldValue !== newValue) {
      this.#updateSelectedVerseFromAttribute();
    }
  }
}

window.customElements.define(
  "bible-verse-drop-down-list",
  BibleVerseDropDownList,
);

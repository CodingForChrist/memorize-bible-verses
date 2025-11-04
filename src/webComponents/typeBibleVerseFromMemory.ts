import { CUSTOM_EVENTS } from "../constants";
import type { CustomEventUpdateRecitedBibleVerse } from "../types";

export class TypeBibleVerseFromMemory extends HTMLElement {
  #textInputValue?: string;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(this.#containerElement);
  }

  static get observedAttributes() {
    return ["verse-reference"];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get textInputValue(): string | undefined {
    return this.#textInputValue;
  }

  set textInputValue(value: string) {
    this.#textInputValue = value;

    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENTS.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse: this.#textInputValue },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateRecitedBibleVerse);
  }

  get #containerElement() {
    const divElement = document.createElement("div");

    const textAreaElement = document.createElement("textarea");
    textAreaElement.id = "textarea-bible-verse-from-memory";
    textAreaElement.rows = 5;
    textAreaElement.placeholder = `Type in the verse reference from memory...`;

    textAreaElement.addEventListener("focusout", () => {
      this.textInputValue = textAreaElement.value;
    });

    divElement.appendChild(textAreaElement);

    return divElement;
  }

  #updateTextareaPlaceholderText() {
    const textAreaElement = this.shadowRoot!.querySelector(
      "#textarea-bible-verse-from-memory",
    ) as HTMLTextAreaElement;

    textAreaElement.placeholder = `Type in ${this.verseReference ?? "the verse reference"} from memory...`;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      textarea {
        font: inherit;
        color: inherit;
        width: 100%;
        padding: 1rem;
        background-color: var(--color-primary-mint-cream);
        border: 1px solid var(--color-light-gray);
        border-radius: 1.5rem;
        box-sizing: border-box;
      }
      textarea:focus, textarea:active {
        border-color: var(--color-primary-mint-cream);
        outline: 1px solid var(--color-gray);
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "verse-reference" && oldValue !== newValue) {
      return this.#updateTextareaPlaceholderText();
    }
  }
}

window.customElements.define(
  "type-bible-verse-from-memory",
  TypeBibleVerseFromMemory,
);

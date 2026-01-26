import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

import { VerseReferenceSchema } from "../../schemas/verse-reference-schema";
import { getStateFromURL } from "../../services/router";
import {
  formControlStyles,
  buttonStyles,
} from "../../components/shared-styles";
import { getAllBibleBooks } from "../../data/bible-book-model";

import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";

@customElement("search-form")
export class SearchForm extends LitElement {
  @state()
  verseReference = "";

  @state()
  isValidVerseReference = true;

  @state()
  validationErrorMessage = "";

  #textInput = getStateFromURL()?.verse ?? "";
  inputElementReference: Ref<HTMLInputElement> = createRef();

  static styles = [
    formControlStyles,
    buttonStyles,
    css`
      :host {
        --form-invalid-color: #dc3545;
        --form-invalid-border-color: #dc3545;
        --form-invalid-color-focus-ring: rgba(220, 53, 69, 0.25);
      }

      label {
        display: block;
      }
      label small {
        font-size: 0.75rem;
        line-height: calc(1.25 / 0.875);
      }
      form {
        display: flex;
        gap: 0.25rem;
        margin-top: 0.25rem;
      }
      button[type="submit"] {
        --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        min-width: 6rem;
        height: 2.5rem;
        align-self: flex-start;
      }
      .input-container {
        width: 100%;
      }
      input.invalid {
        color: var(--form-invalid-color);
        border-color: var(--form-invalid-border-color);
        --color-focus-ring: var(--form-invalid-color-focus-ring);
      }
      .invalid-feedback {
        color: var(--form-invalid-color);
        width: 100%;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }
      .hidden {
        display: none;
      }
    `,
  ];

  get #bibleBookNames() {
    return getAllBibleBooks().map((bookName) => {
      if (bookName === "Psalms") {
        return "Psalm";
      }
      return bookName;
    });
  }

  render() {
    return html`
      <label for="input-verse-reference">
        <span>Enter a bible verse reference</span><br />
        <small>e.g. "John 1:1" or "John 3:16-21"</small>
      </label>
      <form @submit=${this.#handleFormSubmit}>
        <div class="input-container">
          <input
            type="text"
            id="input-verse-reference"
            list="bible-book-names"
            .value=${this.#textInput}
            @input=${this.#handleTextInput}
            ${ref(this.inputElementReference)}
            class=${classMap({
              invalid: !this.isValidVerseReference,
            })}
          />
          <datalist id="bible-book-names">
            ${map(
              this.#bibleBookNames,
              (bookName) => html`<option value=${bookName}></option>`,
            )}
          </datalist>
          <div
            class=${classMap({
              "invalid-feedback": true,
              hidden: this.isValidVerseReference,
            })}
          >
            Please enter a valid verse reference. ${this.validationErrorMessage}
          </div>
        </div>
        <button type="submit" class="primary">Search</button>
      </form>
    `;
  }

  firstUpdated() {
    if (this.#textInput) {
      this.#handleFormSubmit(new Event("submit"));
    }
  }

  #handleTextInput(event: Event) {
    this.#textInput = (event.target as HTMLInputElement).value;
  }

  #handleFormSubmit(event: Event) {
    event.preventDefault();

    const results = VerseReferenceSchema.safeParse(this.#textInput);
    if (results.success) {
      this.verseReference = this.#textInput;
      this.isValidVerseReference = true;
      this.validationErrorMessage = "";
    } else {
      this.isValidVerseReference = false;
      this.validationErrorMessage = results.error.issues[0].message;
      this.verseReference = "";
      this.inputElementReference.value?.focus();
    }

    this.#sendFormSubmitEvent(this.verseReference);
  }

  #sendFormSubmitEvent(verseReference: string) {
    const formSubmitEvent = new CustomEvent<{
      verseReference: string;
    }>("submit", {
      detail: { verseReference },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(formSubmitEvent);
  }
}

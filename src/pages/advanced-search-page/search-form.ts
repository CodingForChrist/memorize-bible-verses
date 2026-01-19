import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { z } from "zod";

import { VerseReferenceSchema } from "../../schemas/verse-reference-schema";
import { getStateFromURL } from "../../services/router";
import {
  formControlStyles,
  buttonStyles,
} from "../../components/shared-styles";
import {
  oldTestamentBooks,
  newTestamentBooks,
} from "../../data/bible-books.json";

import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";

@customElement("search-form")
export class SearchForm extends LitElement {
  @state()
  verseReference = getStateFromURL()?.verse;

  @state()
  isValidVerseReference = true;

  @state()
  validationErrorMessage = "";

  #textInput = this.verseReference ?? "";
  inputElementReference: Ref<HTMLInputElement> = createRef();

  static styles = [
    formControlStyles,
    buttonStyles,
    css`
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
        color: #dc3545;
        border-color: #dc3545;
        --color-focus-ring: rgba(220, 53, 69, 0.25);
      }
      .invalid-feedback {
        color: #dc3545;
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
    return [
      ...oldTestamentBooks.map((bookName) => {
        if (bookName === "Psalms") {
          return "Psalm";
        }
        return bookName;
      }),
      ...newTestamentBooks,
    ];
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
            Please enter a valid verse reference<br />
            ${this.validationErrorMessage}
          </div>
        </div>
        <button type="submit" class="primary">Search</button>
      </form>
    `;
  }

  firstUpdated() {
    if (this.verseReference) {
      this.#sendFormSubmitEvent(this.verseReference);
    }

    this.inputElementReference.value?.focus();
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
      this.validationErrorMessage = z.prettifyError(results.error);
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

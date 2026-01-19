import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";
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
        <input
          type="text"
          id="input-verse-reference"
          list="bible-book-names"
          .value=${this.#textInput}
          @input=${this.#handleTextInput}
          ${ref(this.inputElementReference)}
          required
        />
        <datalist id="bible-book-names">
          ${map(
            this.#bibleBookNames,
            (bookName) => html`<option value=${bookName}></option>`,
          )}
        </datalist>

        <button type="submit" class="primary">Search</button>
      </form>
      ${this.validationErrorMessage}
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
      this.#sendFormSubmitEvent(this.verseReference);
    } else {
      this.isValidVerseReference = false;
      this.validationErrorMessage = z.prettifyError(results.error);
    }
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

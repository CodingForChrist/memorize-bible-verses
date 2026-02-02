import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { getStateFromURL } from "../services/router";
import { getBibleTranslationFromLocalStorage } from "../services/local-storage";
import { formControlStyles } from "./shared-styles";
import { CUSTOM_EVENT } from "../constants";
import {
  getAllBibleTranslations,
  findBibleTranslationByAbbreviation,
} from "../data/bible-translation-model";

import "./alert-message";
import "./loading-spinner";

import type { BibleTranslation } from "../schemas/bible-translation-schema";

@customElement("bible-translation-drop-down-list")
export class BibleTranslationDropDownList extends LitElement {
  @state()
  bibleId: string = this.#defaultBibleId;

  bibleTranslations = this.#sortedBibleTranslations;

  static styles = [
    formControlStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  get #sortedBibleTranslations() {
    return getAllBibleTranslations().sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  get #defaultBibleId() {
    const abbreviation =
      getStateFromURL()?.translation ||
      getBibleTranslationFromLocalStorage()?.abbreviation ||
      "NKJV";

    const { id } = findBibleTranslationByAbbreviation(abbreviation);
    return id;
  }

  render() {
    return html`
      <select
        id="select-bible-translation"
        aria-label="Bible Translation Selection"
        .value="${this.bibleId}"
        @change=${this.#handleSelectElementChange}
      >
        ${this.bibleTranslations.map(
          ({ id, name }) => html`
            <option .value=${id} ?selected=${id === this.bibleId}>
              ${name}
            </option>
          `,
        )}
      </select>
    `;
  }

  firstUpdated() {
    this.#sendEventForSelectedBibleTranslation();
  }

  #handleSelectElementChange(event: Event) {
    this.bibleId = (event.target as HTMLSelectElement).value;
    this.#sendEventForSelectedBibleTranslation();
  }

  #sendEventForSelectedBibleTranslation() {
    const bibleTranslation = this.bibleTranslations.find(
      (bibleTranslation) => bibleTranslation.id === this.bibleId,
    );
    if (!bibleTranslation) {
      throw new Error("Failed to find the bible translation by id");
    }

    const eventUpdateSelectedBibleTranslation = new CustomEvent<{
      bibleTranslation: BibleTranslation;
    }>(CUSTOM_EVENT.UPDATE_BIBLE_TRANSLATION, {
      detail: {
        bibleTranslation,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateSelectedBibleTranslation);
  }
}

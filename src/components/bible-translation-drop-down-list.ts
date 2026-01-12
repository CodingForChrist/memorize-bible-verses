import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Task } from "@lit/task";

import { fetchBibleTranslationsWithCache } from "../services/api";
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

  bibleTranslations: BibleTranslation[] = [];

  static styles = [
    formControlStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  #bibleTranslationTask = new Task(this, {
    task: async () => {
      const ids = getAllBibleTranslations()
        .map(({ id }) => id)
        .toString();
      const bibleTranslationsResult = await fetchBibleTranslationsWithCache({
        language: "eng",
        includeFullDetails: true,
        ids,
      });

      this.bibleTranslations = bibleTranslationsResult.sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      this.#sendEventForSelectedBibleTranslation();
    },
    args: () => [],
  });

  render() {
    return this.#bibleTranslationTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: () => html`
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
      `,
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Internal Server Error";
        return html`
          <alert-message type="danger">
            Failed to load bibles. <br />${errorMessage}
          </alert-message>
        `;
      },
    });
  }

  get #defaultBibleId() {
    const abbreviation =
      getStateFromURL()?.translation ||
      getBibleTranslationFromLocalStorage()?.abbreviation ||
      "NKJV";

    const { id } = findBibleTranslationByAbbreviation(abbreviation);
    return id;
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

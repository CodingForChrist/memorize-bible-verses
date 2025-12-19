import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";
import { Task } from "@lit/task";

import { fetchBibleTranslationsWithCache } from "../services/api";
import { getStateFromURL } from "../services/router";
import { formControlStyles } from "./shared-styles";
import {
  getAllBibleTranslations,
  findBibleTranslationByAbbreviation,
  findBibleTranslationById,
} from "../data/bible-translation-model";

import { CUSTOM_EVENT } from "../constants";

import type {
  BibleTranslation,
  CustomEventUpdateBibleTranslation,
} from "../types";

type BibleTranslationWithCustomLabel = BibleTranslation & {
  customLabel: string;
};

@customElement("bible-translation-drop-down-list")
export class BibleTranslationDropDownList extends LitElement {
  @state()
  bibleId: string = this.#defaultBibleId;

  bibleTranslations: BibleTranslationWithCustomLabel[] = [];

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
      const bibleData = await fetchBibleTranslationsWithCache({
        language: "eng",
        includeFullDetails: true,
        ids,
      });
      this.bibleTranslations = this.#validateAndEnhanceBibleData(bibleData);
      this.#sendEventForSelectedBibleTranslation();
    },
    args: () => [],
  });

  #validateAndEnhanceBibleData(bibleData: Record<string, unknown>) {
    if (!Array.isArray(bibleData.data)) {
      throw new TypeError("expected data to be an array");
    }

    const enhancedBibleData: BibleTranslationWithCustomLabel[] =
      bibleData.data.map((bible: BibleTranslation) => {
        const { label } = findBibleTranslationById(bible.id);
        return {
          ...bible,
          customLabel: label,
        };
      });

    return enhancedBibleData.sort((a, b) =>
      a.customLabel.localeCompare(b.customLabel),
    );
  }

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
            ({ id, customLabel }) => html`
              <option .value=${id} ?selected=${id === this.bibleId}>
                ${customLabel}
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
    const abbreviation = getStateFromURL()?.translation || "NKJV";

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

    const eventUpdateSelectedBibleTranslation =
      new CustomEvent<CustomEventUpdateBibleTranslation>(
        CUSTOM_EVENT.UPDATE_BIBLE_TRANSLATION,
        {
          detail: {
            bibleTranslation,
          },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateSelectedBibleTranslation);
  }
}

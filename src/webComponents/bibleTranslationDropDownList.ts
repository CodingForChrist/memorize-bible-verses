import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";
import { Task } from "@lit/task";

import { fetchBibleTranslationsWithCache } from "../services/api";
import { formSelectStyles } from "./sharedStyles";
import {
  getAllBibleTranslations,
  findBibleTranslationByAbbreviation,
  findBibleTranslationById,
} from "../data/bibleTranslationModel";

import { CUSTOM_EVENTS } from "../constants";

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
    formSelectStyles,
    css`
      :host {
        display: block;
      }
      select:has(option.label-long:checked) {
        font-size: 80%;

        @media (width >= 24rem) {
          font-size: 85%;
        }
        @media (width >= 28rem) {
          font-size: 90%;
        }
        @media (width >= 32rem) {
          font-size: 100%;
        }
      }
    `,
  ];

  #bibleTranslationTask = new Task(this, {
    task: async () => {
      try {
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
      } catch (error) {
        throw new Error(`Error fetching bibles: ${error}`);
      }
    },
    args: () => [],
  });

  #validateAndEnhanceBibleData(bibleData: any) {
    if (!Array.isArray(bibleData.data)) {
      throw new Error("expected data to be an array");
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
      error: () => html`
        <alert-message type="danger">
          Failed to load bibles. Please try again later.
        </alert-message>
      `,
    });
  }

  get #defaultBibleId() {
    const abbreviation =
      new URL(window.location.href).searchParams.get("translation") || "NKJV";

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
        CUSTOM_EVENTS.UPDATE_BIBLE_TRANSLATION,
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

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { Task } from "@lit/task";

import { fetchBibleTranslationsWithCache } from "../services/api";
import { router } from "../services/router";
import { formSelectStyles } from "./sharedStyles";
import localBibleTranslations from "../data/bibleTranslations.json";

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
  @property({ attribute: "bible-id", reflect: true })
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
        const bibleData = await fetchBibleTranslationsWithCache({
          language: "eng",
          ids: localBibleTranslations.map(({ id }) => id).toString(),
          includeFullDetails: true,
        });
        this.bibleTranslations = this.#validateAndEnhanceBibleData(bibleData);
        this.#sendEventForSelectedBibleTranslation(this.bibleId);
        return this.bibleTranslations;
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
        const foundLocalBibleTranslation = localBibleTranslations.find(
          ({ id }) => bible.id === id,
        );
        if (!foundLocalBibleTranslation) {
          throw new Error("Failed to find the supported bible by id");
        }
        return {
          ...bible,
          customLabel: foundLocalBibleTranslation.label,
        };
      });

    return enhancedBibleData.sort((a, b) =>
      a.customLabel.localeCompare(b.customLabel),
    );
  }

  #renderSelectElement() {
    return html`
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
    `;
  }

  render() {
    if (this.bibleTranslations.length) {
      return this.#renderSelectElement();
    }

    return this.#bibleTranslationTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: () => this.#renderSelectElement(),
      error: () => html`
        <alert-message type="danger">
          <span slot="alert-message"
            >Failed to load bibles. Please try again later.</span
          >
        </alert-message>
      `,
    });
  }

  #handleSelectElementChange(event: Event) {
    this.bibleId = (event.target as HTMLSelectElement).value;
    this.#sendEventForSelectedBibleTranslation(this.bibleId);
  }

  get #defaultBibleId() {
    const abbreviation = router.getParam("translation") || "NKJV";
    const localBibleTranslation = localBibleTranslations.find(
      (bibleTranslation) => bibleTranslation.abbreviationLocal === abbreviation,
    );

    if (!localBibleTranslation) {
      throw new Error("Failed to find the bible translation by abbreviation");
    }
    return localBibleTranslation.id;
  }

  #sendEventForSelectedBibleTranslation(bibleId: string) {
    const bibleTranslation = this.bibleTranslations.find(
      (bibleTranslation) => bibleTranslation.id === bibleId,
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
    window.dispatchEvent(eventUpdateSelectedBibleTranslation);
  }
}

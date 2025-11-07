import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { Task } from "@lit/task";

import { router } from "../services/router";
import localBibleTranslations from "../data/bibleTranslations.json";

import {
  CUSTOM_EVENTS,
  MEMORIZE_BIBLE_VERSES_API_BASE_URL,
} from "../constants";

import type {
  BibleTranslation,
  CustomEventUpdateBibleTranslation,
} from "../types";

@customElement("bible-translation-drop-down-list")
export class BibleTranslationDropDownList extends LitElement {
  @property({ attribute: "bible-id", reflect: true })
  bibleId: string = this.#defaultBibleId;

  @property({ type: Boolean, reflect: true })
  visible: boolean = false;

  static bibleTranslations: BibleTranslation[] = [];

  static styles = css`
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
      padding: 0.5rem 2rem 0.5rem 0.75rem;
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
  `;

  #bibleTranslationTask = new Task(this, {
    task: async () => {
      const response = await fetch(
        `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles`,
        {
          method: "POST",
          body: JSON.stringify({
            language: "eng",
            ids: localBibleTranslations.map(({ id }) => id).toString(),
            includeFullDetails: true,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_bible_verses_web_app",
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          `Invalid status code returned when fetching bibles: ${response.status}`,
        );
      }

      try {
        const json = await response.json();
        const enhancedBibleData = this.#validateAndEnhanceBibleData(json);
        BibleTranslationDropDownList.bibleTranslations = enhancedBibleData;
        this.#sendEventForSelectedBibleTranslation(this.bibleId);
        return enhancedBibleData;
      } catch (error) {
        throw new Error(`Invalid data returned when fetching bibles: ${error}`);
      }
    },
    args: () => [],
    autoRun: false,
  });

  #validateAndEnhanceBibleData(bibleData: any) {
    if (!Array.isArray(bibleData.data)) {
      throw new Error("expected data to be an array");
    }

    const enhancedBibleData: BibleTranslation[] = bibleData.data.map(
      (bible: BibleTranslation) => {
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
      },
    );

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
        ${BibleTranslationDropDownList.bibleTranslations.map(
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
    if (!this.visible) {
      return null;
    }

    if (BibleTranslationDropDownList.bibleTranslations.length) {
      return this.#renderSelectElement();
    }

    return this.#bibleTranslationTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: () => this.#renderSelectElement(),
      error: () => html`
        <alert-message type="danger">
          <span slot="alert-message"
            >Failed to load Bibles. Please try again later.</span
          >
        </alert-message>
      `,
    });
  }

  updated(changedProperties: PropertyValues<this>) {
    if (!changedProperties.has("visible")) {
      return;
    }

    if (
      this.visible &&
      !BibleTranslationDropDownList.bibleTranslations.length
    ) {
      this.#bibleTranslationTask.run();
    }
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
    const bibleTranslation =
      BibleTranslationDropDownList.bibleTranslations.find(
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

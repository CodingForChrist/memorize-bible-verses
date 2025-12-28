import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import {
  formControlStyles,
  buttonStyles,
} from "../../components/shared-styles";
import {
  formatDate,
  parseDate,
  addDays,
  subtractDays,
} from "./date-time-utility";

import "./bible-verse-of-the-day-fetch-result";
import "./verse-list-fetch-result";
import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/modal-dialog";

@customElement("verse-of-the-day-page")
export class VerseOfTheDayPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ type: Object })
  dateForVerseOfTheDay: Date = new Date();

  @state()
  isDialogOpen: boolean = false;

  pageTitle = "Verse of the Day";

  static styles = [
    formControlStyles,
    buttonStyles,
    css`
      bible-verse-of-the-day-fetch-result {
        margin-top: 2rem;
      }
      .date-picker-container {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        max-width: 20rem;
        margin: 0 auto 2rem;
      }
      button.svg-icon-container {
        padding: 0.5rem;
        margin: 0 0.5rem;
      }
      button.svg-icon-container svg {
        width: 1.5rem;
        height: 1.5rem;
      }
      button.svg-icon-container:hover svg,
      button.svg-icon-container:focus-visible svg {
        stroke-width: 2;
      }
      button.svg-icon-container:focus-visible {
        box-shadow: none;
      }
      .verse-list-container {
        margin-top: 4rem;
        text-align: center;
        font-size: 0.875rem;
      }
      .verse-list-container button.secondary {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
    `,
  ];

  #renderModalDialogContent() {
    if (!this.isDialogOpen) {
      return;
    }
    return html`
      <span slot="heading">2026 Verse List</span>
      <span slot="body">
        <verse-list-fetch-result year="2026"></verse-list-fetch-result>
      </span>
    `;
  }

  render() {
    const dateShortFormat = formatDate(this.dateForVerseOfTheDay, "YYYY-MM-DD");
    const dateLongFormat = formatDate(
      this.dateForVerseOfTheDay,
      "dddd, MMMM D, YYYY",
    );

    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Verse of the Day</span>

        <p slot="page-description">
          Practice memorizing the verse of the day for
          <span id="page-heading-date">${dateLongFormat}</span>.
        </p>
        <p slot="page-description">When you have it memorized go to Step 2.</p>

        <span slot="page-content">
          <div class="date-picker-container">
            <button
              type="button"
              aria-label="show verse for previous day"
              class="svg-icon-container"
              @click=${this.#handlePreviousDay}
            >
              ${this.#chevronLeftIcon}
            </button>
            <input
              type="date"
              id="date-picker-for-verse-of-the-day"
              aria-label="Date for Verse of the Day"
              min="2025-01-01"
              max="2026-12-31"
              .value=${dateShortFormat}
              @input=${this.#handleDateInputChange}
            />
            <button
              type="button"
              aria-label="show verse for next day"
              class="svg-icon-container"
              @click=${this.#handleNextDay}
            >
              ${this.#chevronRightIcon}
            </button>
          </div>
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          <bible-verse-of-the-day-fetch-result
            date=${dateShortFormat}
            bible-id=${ifDefined(this.bibleId)}
          >
          </bible-verse-of-the-day-fetch-result>

          <modal-dialog
            ?open=${this.isDialogOpen}
            @close=${() => {
              this.isDialogOpen = false;
            }}
          >
            ${this.#renderModalDialogContent()}
          </modal-dialog>

          <div class="verse-list-container">
            <button
              type="button"
              class="secondary"
              @click=${this.#handleButtonClickToShowDialog}
            >
              Verse List for 2026
            </button>
          </div>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  get #chevronLeftIcon() {
    // chevron-left from https://heroicons.com/
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    `;
  }

  get #chevronRightIcon() {
    // chevron-right from https://heroicons.com/
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    `;
  }

  #handleDateInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value) {
      this.dateForVerseOfTheDay = parseDate(value, "YYYY-MM-DD");
    }
  }

  #handlePreviousDay() {
    this.dateForVerseOfTheDay = subtractDays(this.dateForVerseOfTheDay, 1);
  }

  #handleNextDay() {
    this.dateForVerseOfTheDay = addDays(this.dateForVerseOfTheDay, 1);
  }

  #handleButtonClickToShowDialog() {
    this.isDialogOpen = true;
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.VERSE_OF_THE_DAY_PAGE,
    });
  }
}

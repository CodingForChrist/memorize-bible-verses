import { LitElement, css, html, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";
import {
  formatDate,
  addDays,
  subtractDays,
} from "../../services/dateTimeUtility";

@customElement(WEB_COMPONENT_PAGES.SEARCH_VERSE_OF_THE_DAY_PAGE)
export class SearchVerseOfTheDayPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property({ type: Object })
  dateForVerseOfTheDay: Date = new Date();

  pageTitle = "Verse of the Day";

  static styles = css`
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
    bible-verse-of-the-day-fetch-result {
      margin-top: 2rem;
    }
    input[type="date"] {
      font: inherit;
      color: inherit;
      line-height: 1.5rem;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      background-color: var(--color-primary-mint-cream);
      border: 1px solid var(--color-light-gray);
      border-radius: 1.5rem;
      padding: 0.5rem 0.75rem;
      -webkit-appearance: none;
    }
    input[type="date"]:focus {
      border-color: var(--color-primary-mint-cream);
      outline: 1px solid var(--color-gray);
    }
    input[type="date"]::-webkit-date-and-time-value {
      text-align: center;
    }
    .date-picker-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .date-picker-container svg {
      width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.25rem;
      margin: 0 0.75rem;
      flex-shrink: 0;
      cursor: pointer;
    }
  `;

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
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>
            Practice memorizing the verse of the day for
            <span id="page-heading-date">${dateLongFormat}</span>.
          </p>
          <p>When you have it memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <div class="date-picker-container">
            ${this.#chevronLeftIcon}
            <input
              type="date"
              name="date-picker-for-verse-of-the-day"
              min="2025-01-01"
              max="2026-12-31"
              .valueAsDate=${this.dateForVerseOfTheDay}
              @input=${this.#handleDateInputChange}
            />
            ${this.#chevronRightIcon}
          </div>
          <bible-translation-drop-down-list
            bible-id=${this.bibleId || nothing}
            ?visible=${this.visible}
          ></bible-translation-drop-down-list>

          <bible-verse-of-the-day-fetch-result
            date=${dateShortFormat}
            bible-id=${this.bibleId}
            is-visible=${this.visible}
          >
          </bible-verse-of-the-day-fetch-result>
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
        @click=${this.#handlePreviousDay}
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
        @click=${this.#handleNextDay}
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
    const valueAsDate = (event.target as HTMLInputElement).valueAsDate;

    if (valueAsDate) {
      this.dateForVerseOfTheDay = valueAsDate;
    }
  }

  #handlePreviousDay() {
    this.dateForVerseOfTheDay = subtractDays(this.dateForVerseOfTheDay, 1);
  }

  #handleNextDay() {
    this.dateForVerseOfTheDay = addDays(this.dateForVerseOfTheDay, 1);
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: WEB_COMPONENT_PAGES.SEARCH_VERSE_OF_THE_DAY_PAGE,
    });
  }
}

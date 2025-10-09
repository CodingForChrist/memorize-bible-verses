import { BasePage } from "./basePage";
import {
  parseDate,
  formatDate,
  addDays,
  subtractDays,
} from "../../services/dateTimeUtility";

export class SearchVerseOfTheDayPage extends BasePage {
  #dateForVerseOfTheDay: Date;

  constructor() {
    super();

    this.#dateForVerseOfTheDay = new Date();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [...BasePage.observedAttributes, "bible-id"];
  }

  get pageTitle() {
    return "︎Verse of the Day | Memorize Bible Verses";
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get #bibleTranslationDropDownListElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-drop-down-list",
    ) as HTMLElement;
  }

  get #bibleVerseOfTheDayFetchResultElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-of-the-day-fetch-result",
    ) as HTMLElement;
  }

  get #pageHeadingDateElement() {
    return this.shadowRoot!.querySelector("#page-heading-date") as HTMLElement;
  }

  get #inputDateElement() {
    return this.shadowRoot!.querySelector(
      "#date-picker-for-verse-of-the-day",
    ) as HTMLInputElement;
  }

  get dateForVerseOfTheDay() {
    return this.#dateForVerseOfTheDay;
  }

  set dateForVerseOfTheDay(value: Date) {
    this.#dateForVerseOfTheDay = value;

    this.#pageHeadingDateElement.innerText = formatDate(
      this.dateForVerseOfTheDay,
      "dddd, MMMM D, YYYY",
    );

    this.#bibleVerseOfTheDayFetchResultElement.setAttribute(
      "date",
      formatDate(this.dateForVerseOfTheDay, "YYYY-MM-DD"),
    );
  }

  get #containerElement() {
    const dateShortFormat = formatDate(this.dateForVerseOfTheDay, "YYYY-MM-DD");
    const dateLongFormat = formatDate(
      this.dateForVerseOfTheDay,
      "dddd, MMMM D, YYYY",
    );

    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Practice memorizing the verse of the day for
            <span id="page-heading-date">${dateLongFormat}</span>.
          </p>
          <p>When you have it memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <div class="date-picker-container">
            ${this.#chevronLeftIcon}
            <input
              type="date"
              id="date-picker-for-verse-of-the-day"
              name="date-picker-for-verse-of-the-day"
              value="${dateShortFormat}"
              min="2025-01-01"
              max="2026-12-31"
            />
            ${this.#chevronRightIcon}
          </div>
          <bible-translation-drop-down-list></bible-translation-drop-down-list>
          <bible-verse-of-the-day-fetch-result
            date="${dateShortFormat}">
          </bible-verse-of-the-day-fetch-result>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;

    return divElement;
  }

  get #chevronLeftIcon() {
    // chevron-left from https://heroicons.com/
    return `
      <svg xmlns="http://www.w3.org/2000/svg" id="chevron-left-icon" fill="none"
        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    `;
  }

  get #chevronRightIcon() {
    // chevron-right from https://heroicons.com/
    return `
      <svg xmlns="http://www.w3.org/2000/svg" id="chevron-right-icon" fill="none"
        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    `;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
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
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-back-button-click", () =>
      this.navigateToPage({ nextPage: "search-options-page" }),
    );

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-forward-button-click", () =>
      this.navigateToPage({
        nextPage: "speak-page",
        previousPage: "search-verse-of-the-day-page",
      }),
    );

    this.#inputDateElement.addEventListener("change", () => {
      if (!this.#inputDateElement.value) {
        return;
      }

      this.dateForVerseOfTheDay = parseDate(
        this.#inputDateElement.value,
        "YYYY-MM-DD",
      );
    });

    this.shadowRoot!.querySelector("#chevron-left-icon")?.addEventListener(
      "click",
      () => {
        this.dateForVerseOfTheDay = subtractDays(this.dateForVerseOfTheDay, 1);
        this.#inputDateElement.value = formatDate(
          this.dateForVerseOfTheDay,
          "YYYY-MM-DD",
        );
      },
    );

    this.shadowRoot!.querySelector("#chevron-right-icon")?.addEventListener(
      "click",
      () => {
        this.dateForVerseOfTheDay = addDays(this.dateForVerseOfTheDay, 1);
        this.#inputDateElement.value = formatDate(
          this.dateForVerseOfTheDay,
          "YYYY-MM-DD",
        );
      },
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of SearchVerseOfTheDayPage.observedAttributes) {
      if (name === attributeName) {
        this.#bibleTranslationDropDownListElement?.setAttribute(
          attributeName,
          newValue,
        );
        this.#bibleVerseOfTheDayFetchResultElement?.setAttribute(
          attributeName,
          newValue,
        );
      }
    }
  }
}

window.customElements.define(
  "search-verse-of-the-day-page",
  SearchVerseOfTheDayPage,
);

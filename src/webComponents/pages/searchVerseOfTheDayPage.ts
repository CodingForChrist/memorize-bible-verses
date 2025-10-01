import { BasePage } from "./basePage";
import { parseDate, formatDate } from "../../services/formatDateTime";

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
      "MMMM DD, YYYY",
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
      "MMMM DD, YYYY",
    );

    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Practice memorizing the verse of the day for
            <br>
            <span id="page-heading-date">
              ${dateLongFormat}
            </span>.
          </p>
          <p>When you have it memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <input
            type="date"
            id="date-picker-for-verse-of-the-day"
            name="date-picker-for-verse-of-the-day"
            value="${dateShortFormat}"
            min="2025-01-01"
            max="2026-12-31"
          />
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

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      p {
        margin: 1rem 0;
      }
      bible-verse-of-the-day-fetch-result {
        margin-top: 2rem;
      }
      input[type="date"] {
        font: inherit;
        color: inherit;
        line-height: 1.5rem;
        box-sizing: border-box;
        width: 100%;
        background-color: var(--color-primary-mint-cream);
        border: 1px solid var(--color-light-gray);
        border-radius: 1.5rem;
        margin-bottom: 2rem;
        padding: 0.5rem 0.75rem;
      }
      input[type="date"]:focus {
        border-color: var(--color-primary-mint-cream);
        outline: 1px solid var(--color-gray);
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

    this.#inputDateElement.addEventListener("click", () => {
      if (this.#inputDateElement.showPicker) {
        return this.#inputDateElement.showPicker();
      }

      // fallback for browsers that don't support showPicker()
      this.#inputDateElement.focus();
    });

    this.#inputDateElement.addEventListener("change", () => {
      if (!this.#inputDateElement.value) {
        return;
      }

      this.dateForVerseOfTheDay = parseDate(
        this.#inputDateElement.value,
        "YYYY-MM-DD",
      );
    });
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

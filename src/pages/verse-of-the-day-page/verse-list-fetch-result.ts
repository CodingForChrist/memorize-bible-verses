import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";

import { fetchVerseOfTheDayVerseListWithCache } from "../../services/api";
import { parseDate, getMonthName } from "./date-time-utility";
import { buttonStyles, breakpointsREM } from "../../components/shared-styles";

import "../../components/alert-message";
import "../../components/loading-spinner";

type VerseOfTheDayVerse = {
  date: string;
  formattedDate: string;
  verse: string;
};

@customElement("verse-list-fetch-result")
export class VerseListFetchResult extends LitElement {
  @property({ reflect: true })
  year: string = "2026";

  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
      }
      h2 {
        margin: 1rem 0;
        padding: 2rem 0;
        margin: 2rem 0;
        font-size: 2rem;
        font-weight: 400;
        border-top: 1px solid var(--color-light-gray);
        border-bottom: 1px solid var(--color-light-gray);
        text-align: center;
      }
      h2:first-child {
        margin-top: 0;
      }
      .grid-container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem 0.5rem;
        align-items: center;

        @media (min-width: ${breakpointsREM.large}rem) {
          grid-template-columns: 1fr 3fr;
        }
      }
      button.secondary {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
    `,
  ];

  #verseListTask = new Task(this, {
    task: async ([year]) => {
      const verseListData = await fetchVerseOfTheDayVerseListWithCache({
        year,
      });
      return verseListData;
    },
    args: () => [this.year],
  });

  #abbreviatedDate(dateAsString: string) {
    const date = parseDate(dateAsString, "YYYY-MM-DD");
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      weekday: "short",
    };

    return date.toLocaleDateString("en-US", options);
  }

  #groupByMonth(verseList: VerseOfTheDayVerse[]) {
    const monthMap: Record<string, VerseOfTheDayVerse[]> = {};

    for (const verseOfTheDayEntry of verseList) {
      const date = parseDate(verseOfTheDayEntry.date, "YYYY-MM-DD");
      const monthName = getMonthName(date);
      if (Array.isArray(monthMap[monthName])) {
        monthMap[monthName].push(verseOfTheDayEntry);
      } else {
        monthMap[monthName] = [verseOfTheDayEntry];
      }
    }
    return Object.entries(monthMap);
  }

  render() {
    return this.#verseListTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (verseListData) => {
        return this.#groupByMonth(verseListData).map(
          ([monthName, verseSet]) => html`
            <h2>${monthName}</h2>
            <div class="grid-container">
              ${verseSet.map(
                ({ verse, date }) => html`
                  <span>${this.#abbreviatedDate(date)}</span>
                  <button
                    type="button"
                    class="secondary"
                    @click=${this.#handleClick}
                    data-date=${date}
                  >
                    ${verse}
                  </button>
                `,
              )}
            </div>
          `,
        );
      },
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Internal Server Error";
        return html`
          <alert-message type="danger">
            Failed to load verse list. <br />${errorMessage}
          </alert-message>
        `;
      },
    });
  }

  #handleClick(event: Event) {
    const date = (event.target as HTMLButtonElement).dataset.date;
    if (!date) {
      throw new Error("verse of the day button missing date");
    }
    const changeEvent = new CustomEvent<{
      date: string;
    }>("change", {
      detail: { date },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  }
}

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { Task } from "@lit/task";

import { fetchVerseOfTheDayVerseListWithCache } from "../../services/api";
import { formatDate, parseDate } from "./date-time-utility";
import { hyperlinkStyles } from "../../components/shared-styles";

@customElement("verse-list-fetch-result")
export class VerseListFetchResult extends LitElement {
  @property({ reflect: true })
  year: string = "2026";

  static styles = [
    hyperlinkStyles,
    css`
      :host {
        display: block;
      }
      li {
        margin-bottom: 0.5rem;
      }
      li .date {
        display: inline-block;
        width: 8rem;
      }
    `,
  ];

  #verseListTask = new Task(this, {
    task: async ([year]) => {
      try {
        const verseListData = await fetchVerseOfTheDayVerseListWithCache({
          year,
        });
        return verseListData;
      } catch (error) {
        throw new Error(`Error fetching verse list: ${error}`);
      }
    },
    args: () => [this.year],
  });

  #abbreviatedDate(dateAsString: string) {
    const date = parseDate(dateAsString, "YYYY-MM-DD");
    return formatDate(date, "ddd, MMM DD, YYYY");
  }

  render() {
    return this.#verseListTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (verseListData) => html`
        <ul>
          ${verseListData.map(
            ({ date, verse }) => html`
              <li>
                <span class="date">${this.#abbreviatedDate(date)}</span>
                <a
                  href=${`/memorize-bible-verses/#/search-advanced?verse=${verse}`}
                  >${verse}</a
                >
              </li>
            `,
          )}
        </ul>
      `,
      error: (error) => html`
        <alert-message type="danger">
          Failed to load bible verse. Please try again later. ${error}
        </alert-message>
      `,
    });
  }
}

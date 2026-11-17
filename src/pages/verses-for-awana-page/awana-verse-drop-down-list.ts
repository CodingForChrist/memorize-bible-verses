import { LitElement, css, html } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Task } from "@lit/task";

import { fetchAwanaBookVerseListWithCache } from "../../services/api";
import { formControlStyles } from "../../components/shared-styles";
import { getStateFromURL } from "../../services/router";

import "../../components/alert-message";
import "../../components/loading-spinner";

type VerseList = { verseReference: string; section: string }[];

@customElement("awana-verse-drop-down-list")
export class AwanaVerseDropDownList extends LitElement {
  static styles = [
    formControlStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  #awanaBookVerseListTask = new Task(this, {
    task: async ([awanaBookId]) => {
      if (!awanaBookId) {
        return;
      }

      const awanaBookVerseList = await fetchAwanaBookVerseListWithCache({
        awanaBookId,
      });

      this.selectedVerseReference = "";
      this.#setVerseReferenceFromQueryString(awanaBookVerseList.verseList);

      return awanaBookVerseList;
    },
    args: () => [this.awanaBookId],
  });

  @property({ attribute: "awana-book-id", reflect: true })
  awanaBookId?: string;

  @state()
  selectedVerseReference = "";

  @query("#select-awana-verse")
  awanaVerseSelectElement?: HTMLSelectElement;

  #setVerseReferenceFromQueryString(verseList: VerseList) {
    const verseReferenceFromQueryString = getStateFromURL()?.verse;
    if (!verseReferenceFromQueryString) {
      return;
    }

    const isValidVerseReference = verseList.some(
      ({ verseReference }) => verseReference === verseReferenceFromQueryString,
    );

    if (!isValidVerseReference) {
      return;
    }

    this.selectedVerseReference = verseReferenceFromQueryString;
    this.#sendSelectedVerseReferenceChangeEvent();
  }

  #groupVersesBySection(verseList: VerseList) {
    type GroupedVerses = Record<string, typeof verseList>;
    const groupedVerses: GroupedVerses = {};

    for (const item of verseList) {
      const mainNumber = item.section.split(".", 1)[0];
      const groupKey = `Unit ${mainNumber}`;

      if (!Object.hasOwn(groupedVerses, groupKey)) {
        groupedVerses[groupKey] = [];
      }

      groupedVerses[groupKey].push(item);
    }

    return groupedVerses;
  }

  #sendSelectedVerseReferenceChangeEvent() {
    if (!this.selectedVerseReference) {
      throw new Error("Failed to send event because no verse is selected");
    }

    const eventUpdateSelectedVerseReference = new CustomEvent<{
      verseReference: string;
    }>("change", {
      detail: { verseReference: this.selectedVerseReference },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateSelectedVerseReference);
  }

  #handleSelectElementChange(event: Event) {
    this.selectedVerseReference = (event.target as HTMLSelectElement).value;
    this.#sendSelectedVerseReferenceChangeEvent();
  }

  #renderVersesBySection(verseList: VerseList) {
    const groupedVerses = this.#groupVersesBySection(verseList);
    return html`
      ${Object.entries(groupedVerses).map(
        ([unit, verseList]) =>
          html`<optgroup label=${unit}>
            ${verseList.map(
              ({ verseReference }) => html`
                <option
                  .value=${verseReference}
                  ?selected=${verseReference === this.selectedVerseReference}
                >
                  ${verseReference}
                </option>
              `,
            )}
          </optgroup>`,
      )}
    `;
  }

  render() {
    if (!this.awanaBookId) {
      return;
    }

    return this.#awanaBookVerseListTask.render({
      pending: () => html`<loading-spinner></loading-spinner>`,
      complete: (awanaBookVerseList) => {
        if (!awanaBookVerseList || !this.awanaBookId) {
          return;
        }

        return html`<label for="select-awana-verse">Awana memory verse</label>
          <select
            id="select-awana-verse"
            aria-label="Awana Verse Selection"
            .value=${this.selectedVerseReference}
            @change=${this.#handleSelectElementChange}
          >
            <option
              disabled
              value="default"
              ?selected=${!this.selectedVerseReference}
            >
              -- select a verse --
            </option>
            ${this.#renderVersesBySection(awanaBookVerseList.verseList)}
          </select>`;
      },
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Internal Server Error";
        return html`
          <alert-message type="danger">
            Failed to load awana book verse list. <br />${errorMessage}
          </alert-message>
        `;
      },
    });
  }

  updated() {
    this.awanaVerseSelectElement?.focus();
  }
}

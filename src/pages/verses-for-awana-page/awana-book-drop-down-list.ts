import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { formControlStyles } from "../../components/shared-styles";
import {
  getAwanaBookFromLocalStorage,
  setAwanaBookInLocalStorage,
} from "../../services/local-storage";

import "../../components/alert-message";
import "../../components/loading-spinner";

@customElement("awana-book-drop-down-list")
export class AwanaBookDropDownList extends LitElement {
  static styles = [
    formControlStyles,
    css`
      :host {
        display: block;
      }
      select {
        margin-top: 0.25rem;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true })
  hidden = false;

  @state()
  awanaBookId = getAwanaBookFromLocalStorage()?.awanaBookId ?? "";

  get #awanaBooks() {
    return [
      {
        label: "Sparks HangGlider",
        value: "sparks-hangglider-handbook",
      },
      {
        label: "T&T Mission: Agents of Grace",
        value: "tt-mission-agents-of-grace-kids-handbook",
      },
      {
        label: "T&T Mission: Discovery of Grace",
        value: "tt-mission-discovery-of-grace-kids-handbook",
      },
    ];
  }

  #sendSelectedAwanaBookIdChangeEvent() {
    if (!this.awanaBookId) {
      throw new Error(
        "Failed to send event because no awana book id is selected",
      );
    }

    const eventUpdateSelectedVerseReference = new CustomEvent<{
      awanaBookId: string;
    }>("change", {
      detail: { awanaBookId: this.awanaBookId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateSelectedVerseReference);
  }

  #handleSelectElementChange(event: Event) {
    this.awanaBookId = (event.target as HTMLSelectElement).value;
    setAwanaBookInLocalStorage({ awanaBookId: this.awanaBookId });
    this.#sendSelectedAwanaBookIdChangeEvent();
  }

  render() {
    if (this.hidden) {
      return;
    }

    return html`
      <label for="select-awana-book">Awana book</label>
      <select
        id="select-awana-book"
        aria-label="Awana Book Selection"
        .value=${this.awanaBookId}
        @change=${this.#handleSelectElementChange}
        autofocus
      >
        <option disabled value="default" ?selected=${!this.awanaBookId}>
          -- select a book --
        </option>
        ${this.#awanaBooks.map(
          ({ label, value }) => html`
            <option .value=${value} ?selected=${value === this.awanaBookId}>
              ${label}
            </option>
          `,
        )}
      </select>
    `;
  }

  firstUpdated() {
    if (this.awanaBookId) {
      this.#sendSelectedAwanaBookIdChangeEvent();
    }
  }
}

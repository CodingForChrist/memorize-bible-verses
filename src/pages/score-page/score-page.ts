import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { breakpointsREM } from "../../components/shared-styles";

import "./score-recited-bible-verse";
import "../verse-text-page-template";
import "../../components/alert-message";

@customElement("score-page")
export class ScorePage extends BasePage(LitElement) {
  @property({ attribute: "bible-abbreviation", reflect: true })
  bibleAbbreviation?: string;

  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ attribute: "verse-text-content", reflect: true })
  verseTextContent?: string;

  @property({ attribute: "recited-bible-verse", reflect: true })
  recitedBibleVerse?: string;

  pageTitle = "Score";

  static styles = css`
    :host {
      display: block;
    }
    p {
      margin: 1rem 0;
    }
    table {
      table-layout: auto;
      text-indent: 0;
      border-color: inherit;
      border-collapse: collapse;
    }
    td {
      border-bottom: 1px solid var(--color-light-gray);
      padding: 1rem 0;
    }
    td:first-child {
      padding-right: 1rem;

      @media (min-width: ${breakpointsREM.medium}rem) {
        min-width: 8rem;
        padding-right: 2rem;
      }
    }
  `;

  #renderReport() {
    if (
      !this.bibleAbbreviation ||
      !this.verseReference ||
      !this.verseTextContent ||
      !this.recitedBibleVerse
    ) {
      return;
    }

    // add reference
    const verseText = `${this.verseReference} ${this.verseTextContent} ${this.verseReference}`;

    return html`
      <table>
        <tbody>
          <tr>
            <td>Grade</td>
            <td>
              <score-recited-bible-verse
                type="grade"
                original-bible-verse-text=${verseText}
                recited-bible-verse-text=${this.recitedBibleVerse}
              ></score-recited-bible-verse>
            </td>
          </tr>
          <tr>
            <td>Compare</td>
            <td>
              <score-recited-bible-verse
                type="diff"
                original-bible-verse-text=${verseText}
                recited-bible-verse-text=${this.recitedBibleVerse}
              ></score-recited-bible-verse>
            </td>
          </tr>
          <tr>
            <td>Bible</td>
            <td>${this.bibleAbbreviation}</td>
          </tr>
          <tr>
            <td>Verse Reference</td>
            <td>${this.verseReference}</td>
          </tr>
          <tr>
            <td>Actual Verse</td>
            <td>${this.verseTextContent}</td>
          </tr>
          <tr>
            <td>Recited Verse</td>
            <td>${this.recitedBibleVerse}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Score</span>
        <p slot="page-description">Your results are below.</p>

        <span slot="page-content">
          ${when(
            this.bibleAbbreviation &&
              this.verseReference &&
              this.verseTextContent &&
              this.recitedBibleVerse,
            () => this.#renderReport(),
            () => html`
              <alert-message type="danger">
                Unable to display report. Complete Step 1 and Step 2 first.
              </alert-message>
            `,
          )}
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">New Verse</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
    });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE,
    });
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("verseReference")) {
      this.pageTitle = `Score ${this.verseReference ?? ""}`;
    }
  }
}

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { breakpointsREM, buttonStyles } from "../../components/shared-styles";

@customElement("search-options-page")
export class SearchOptionsPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  pageTitle = "Search Options";

  static styles = [
    buttonStyles,
    css`
      :host {
        margin: 1rem auto;
        text-align: center;
        display: block;
      }
      h1 {
        font-family: var(--font-heading);
        font-size: 2rem;
        font-weight: 400;
        margin: 2rem 0 1rem;

        @media (min-width: ${breakpointsREM.large}rem) {
          font-size: 2.5rem;
          margin: 2rem 0;
        }
      }
      p {
        margin: 0 2.5rem 1rem;
        text-wrap: balance;
      }
      .buttons-container {
        margin-top: 2rem;

        @media (min-width: ${breakpointsREM.small}rem) {
          margin-left: 1rem;
          margin-right: 1rem;
        }
      }
      .buttons-container button {
        --base-padding: 1rem;
        display: block;
        font-size: 1.25rem;
        font-family: var(--font-heading);
        margin-bottom: 1.25rem;
        width: 100%;
      }
      .button-color-blue-green {
        --primary-background-color: var(--color-secondary-blue-green);
        --primary-box-shadow-color-rgb: var(--color-secondary-blue-green-rgb);
        --primary-background-color-hover: var(
          --color-secondary-blue-green-darker-one
        );
        --primary-border-color-hover: var(
          --color-secondary-blue-green-darker-two
        );
      }
      .button-color-bright-pink {
        --primary-background-color: var(--color-primary-bright-pink);
        --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        --primary-background-color-hover: var(
          --color-primary-bright-pink-darker-one
        );
        --primary-border-color-hover: var(
          --color-primary-bright-pink-darker-two
        );
      }
      .button-color-ut-orange {
        --primary-background-color: var(--color-secondary-ut-orange);
        --primary-box-shadow-color-rgb: var(--color-secondary-ut-orange-rgb);
        --primary-background-color-hover: var(
          --color-secondary-ut-orange-darker-one
        );
        --primary-border-color-hover: var(
          --color-secondary-ut-orange-darker-two
        );
      }
      .button-color-jade {
        --primary-background-color: var(--color-secondary-jade);
        --primary-box-shadow-color-rgb: var(--color-secondary-jade-rgb);
        --primary-background-color-hover: var(
          --color-secondary-jade-darker-one
        );
        --primary-border-color-hover: var(--color-secondary-jade-darker-two);
      }
      .button-color-cerulean {
        --primary-background-color: var(--color-secondary-cerulean);
        --primary-box-shadow-color-rgb: var(--color-secondary-cerulean-rgb);
        --primary-background-color-hover: var(
          --color-secondary-cerulean-darker-one
        );
        --primary-border-color-hover: var(
          --color-secondary-cerulean-darker-two
        );
      }
    `,
  ];

  render() {
    const {
      SEARCH_VERSE_OF_THE_DAY_PAGE,
      SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
      SEARCH_PSALM_23_PAGE,
      SEARCH_VERSES_FOR_AWANA_PAGE,
      SEARCH_ADVANCED_PAGE,
    } = PAGE_NAME;

    return html`
      <h1>Search</h1>

      <p>Choose to memorize verses from the options below.</p>

      <div class="buttons-container">
        <button
          type="button"
          class="primary button-color-blue-green"
          @click=${() =>
            this.navigateToPage({
              nextPage: SEARCH_VERSE_OF_THE_DAY_PAGE,
            })}
        >
          Verse of the Day
        </button>

        <button
          type="button"
          class="primary button-color-bright-pink"
          @click=${() =>
            this.navigateToPage({
              nextPage: SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
            })}
        >
          Share the Gospel
        </button>

        <button
          type="button"
          class="primary button-color-ut-orange"
          @click=${() =>
            this.navigateToPage({
              nextPage: SEARCH_PSALM_23_PAGE,
            })}
        >
          Psalm 23
        </button>

        <button
          type="button"
          class="primary button-color-jade"
          @click=${() =>
            this.navigateToPage({
              nextPage: SEARCH_VERSES_FOR_AWANA_PAGE,
            })}
        >
          Awana Club for Kids
        </button>

        <button
          type="button"
          class="primary button-color-cerulean"
          @click=${() =>
            this.navigateToPage({
              nextPage: SEARCH_ADVANCED_PAGE,
            })}
        >
          Power User: Choose Your Verses
        </button>
      </div>
    `;
  }
}

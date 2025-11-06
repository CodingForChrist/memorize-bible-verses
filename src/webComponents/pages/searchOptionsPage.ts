import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE)
export class SearchOptionsPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  pageTitle = "Search Options";

  static styles = css`
    :host {
      margin: 1rem auto;
      text-align: center;
      max-width: 28rem;
      display: block;
    }
    h1 {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 400;
      margin: 2rem 0;

      @media (width >= 40rem) {
        font-size: 2.5rem;
      }
    }
    p {
      margin: 0 2.5rem 1rem;
      text-wrap: balance;
    }
    .buttons-container {
      margin-top: 2rem;

      @media (width >= 28rem) {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
    .buttons-container branded-button {
      --base-padding: 1rem;
      display: block;
      font-size: 1.25rem;
      font-family: var(--font-heading);
      margin-bottom: 1.25rem;
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
      --primary-border-color-hover: var(--color-primary-bright-pink-darker-two);
    }
    .button-color-ut-orange {
      --primary-background-color: var(--color-secondary-ut-orange);
      --primary-box-shadow-color-rgb: var(--color-secondary-ut-orange-rgb);
      --primary-background-color-hover: var(
        --color-secondary-ut-orange-darker-one
      );
      --primary-border-color-hover: var(--color-secondary-ut-orange-darker-two);
    }
    .button-color-jade {
      --primary-background-color: var(--color-secondary-jade);
      --primary-box-shadow-color-rgb: var(--color-secondary-jade-rgb);
      --primary-background-color-hover: var(--color-secondary-jade-darker-one);
      --primary-border-color-hover: var(--color-secondary-jade-darker-two);
    }
    .button-color-cerulean {
      --primary-background-color: var(--color-secondary-cerulean);
      --primary-box-shadow-color-rgb: var(--color-secondary-cerulean-rgb);
      --primary-background-color-hover: var(
        --color-secondary-cerulean-darker-one
      );
      --primary-border-color-hover: var(--color-secondary-cerulean-darker-two);
    }
    .page-navigation {
      margin: 6rem 0 2rem;
      display: flex;
      justify-content: space-between;

      @media (width >= 28rem) {
        margin: 6rem 1rem 2rem;
      }
    }
    .page-navigation branded-button {
      min-width: 6rem;
    }
  `;

  render() {
    return html`
      <h1>Search</h1>

      <p>Choose to memorize verses from the options below.</p>

      <div class="buttons-container">
        <branded-button
          class="button-color-blue-green"
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.SEARCH_VERSE_OF_THE_DAY_PAGE,
            })}
        >
          <span slot="button-text">Verse of the Day</span>
        </branded-button>

        <branded-button
          class="button-color-bright-pink"
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage:
                WEB_COMPONENT_PAGES.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
            })}
        >
          <span slot="button-text">Share the Gospel</span>
        </branded-button>

        <branded-button
          class="button-color-ut-orange"
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.SEARCH_PSALM_23_PAGE,
            })}
        >
          <span slot="button-text">Psalm 23</span>
        </branded-button>

        <branded-button
          class="button-color-jade"
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.SEARCH_VERSES_FOR_AWANA_PAGE,
            })}
        >
          <span slot="button-text">Awana Club for Kids</span>
        </branded-button>

        <branded-button
          class="button-color-cerulean"
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE,
            })}
        >
          <span slot="button-text">Power User: Choose Your Verses</span>
        </branded-button>
      </div>

      <div class="page-navigation">
        <branded-button
          type="button"
          brand="secondary"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.INSTRUCTIONS_PAGE,
            })}
        >
          <span slot="button-text">&lt; Back</span>
        </branded-button>
        <branded-button
          type="button"
          @click=${() =>
            this.navigateToPage({
              nextPage: WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE,
            })}
        >
          <span slot="button-text">Step 1 &gt;</span>
        </branded-button>
      </div>
    `;
  }
}

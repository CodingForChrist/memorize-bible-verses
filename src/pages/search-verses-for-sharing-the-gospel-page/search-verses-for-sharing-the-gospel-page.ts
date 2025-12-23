import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { breakpointsREM, buttonStyles } from "../../components/shared-styles";

@customElement("search-verses-for-sharing-the-gospel-page")
export class SearchVersesForSharingTheGospelPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property()
  verseReference: string = "Romans 3:23";

  pageTitle = "Verses for Sharing the Gospel";

  static styles = [
    buttonStyles,
    css`
      bible-translation-drop-down-list {
        margin-bottom: 1.5rem;
      }
      .verse-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        row-gap: 0.5rem;
        font-size: 80%;

        @media (min-width: ${breakpointsREM.small}rem) {
          font-size: 90%;
        }
        @media (min-width: ${breakpointsREM.medium}rem) {
          font-size: 100%;
        }
        @media (min-width: ${breakpointsREM.extraLarge}rem) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      button.secondary {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        text-wrap: balance;
      }
      .verse-container button.secondary:active,
      .verse-container button.secondary.active {
        --secondary-color: var(--color-primary-mint-cream);
        --secondary-background-color: var(--color-primary-bright-pink);
        --secondary-border-color: var(--color-primary-bright-pink);
        --secondary-color-hover: var(--color-primary-mint-cream);
        --secondary-background-color-hover: var(
          --color-primary-bright-pink-darker-one
        );
      }
      collapsible-content:first-of-type {
        --border-top-right-radius: 1.5rem;
        --border-top-left-radius: 1.5rem;
        --border-bottom-right-radius: 0;
        --border-bottom-left-radius: 0;
      }
      collapsible-content:not(:first-of-type) {
        --border-top-right-radius: 0;
        --border-top-left-radius: 0;
        --border-bottom-right-radius: 0;
        --border-bottom-left-radius: 0;
        border-top: 0;
      }
      collapsible-content:last-of-type {
        --border-top-right-radius: 0;
        --border-top-left-radius: 0;
        --border-bottom-right-radius: 1.5rem;
        --border-bottom-left-radius: 1.5rem;
        margin-bottom: 2rem;
      }
    `,
  ];

  #renderButtonGroup(verses: { verseReference: string; verseLabel: string }[]) {
    return verses.map(({ verseReference, verseLabel }) => {
      const classes = {
        active: this.verseReference === verseReference,
        secondary: true,
      };
      return html`
        <button
          type="button"
          class=${classMap(classes)}
          @click=${this.#handleVerseButtonClick}
          data-verse-reference=${verseReference}
        >
          ${verseLabel}
        </button>
      `;
    });
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Search</span>

        <p slot="page-description">
          Pick and practice a verse for sharing the gospel.
        </p>
        <p slot="page-description">
          When you have the verse memorized go to Step 2.
        </p>

        <div class="page-content" slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          <collapsible-content title="All have sinned" ?expanded=${true}>
            <div class="verse-container">
              ${this.#renderButtonGroup([
                { verseReference: "Romans 3:23", verseLabel: "Romans 3:23" },
                { verseReference: "Romans 6:23", verseLabel: "Romans 6:23" },
                {
                  verseReference: "Ecclesiastes 7:20",
                  verseLabel: "Eccles. 7:20",
                },
                { verseReference: "Isaiah 53:6", verseLabel: "Isaiah 53:6" },
              ])}
            </div>
          </collapsible-content>
          <collapsible-content title="Jesus paid the penalty for our sins">
            <div class="verse-container">
              ${this.#renderButtonGroup([
                { verseReference: "Romans 5:8", verseLabel: "Romans 5:8" },
                {
                  verseReference: "2 Corinthians 5:21",
                  verseLabel: "2 Cor. 5:21",
                },
                { verseReference: "1 Peter 3:18", verseLabel: "1 Peter 3:18" },
                { verseReference: "Romans 5:19", verseLabel: "Romans 5:19" },
              ])}
            </div>
          </collapsible-content>
          <collapsible-content title="Believe in Jesus and be saved">
            <div class="verse-container">
              ${this.#renderButtonGroup([
                {
                  verseReference: "Ephesians 2:8-9",
                  verseLabel: "Ephesians 2:8-9",
                },
                { verseReference: "John 3:16-17", verseLabel: "John 3:16-17" },
                { verseReference: "John 14:6", verseLabel: "John 14:6" },
                { verseReference: "Romans 10:9", verseLabel: "Romans 10:9" },
              ])}
            </div>
          </collapsible-content>

          <bible-verse-fetch-result
            verse-reference=${this.verseReference}
            bible-id=${ifDefined(this.bibleId)}
          ></bible-verse-fetch-result>
        </div>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleVerseButtonClick(event: Event) {
    const selectedButtonElement = event.target as HTMLButtonElement;
    if (!selectedButtonElement.dataset.verseReference) {
      return;
    }
    this.verseReference = selectedButtonElement.dataset.verseReference;
    selectedButtonElement.closest("collapsible-content")?.scrollIntoView();
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
    });
  }
}

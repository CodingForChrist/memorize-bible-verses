import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { classMap } from "lit/directives/class-map.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";

@customElement(WEB_COMPONENT_PAGES.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE)
export class SearchVersesForSharingTheGospelPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @property()
  verseReference: string = "Romans 3:23";

  pageTitle = "Verses for Sharing the Gospel";

  static styles = css`
    bible-translation-drop-down-list {
      margin-bottom: 1.5rem;
    }
    p {
      margin: 1rem 0;
      text-wrap: balance;
    }
    ol {
      margin: 0 0 2rem;
      padding-left: 1rem;
    }
    .page-content {
      min-height: 26rem;
    }
    .verse-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      row-gap: 0.25rem;
      margin: 0.25rem 0 0.75rem -1rem;
      font-size: 85%;

      @media (width >= 28rem) {
        font-size: 90%;
      }

      @media (width >= 32rem) {
        font-size: 100%;
      }
    }
    .verse-container button {
      all: unset;
      color: var(--color-primary-bright-pink);
      text-decoration: underline;
      cursor: pointer;
      padding: 0.25rem 1rem;
      border: 1px solid transparent;
      text-align: left;
    }
    .verse-container button:hover,
    .verse-container button:focus,
    .verse-container button:focus-visible,
    .verse-container button:active,
    .verse-container button.active {
      outline: 0;
      text-decoration: none;
      border: 1px solid var(--color-primary-bright-pink);
      border-radius: 1.5rem;
      background-color: var(--color-primary-bright-pink);
      color: var(--color-primary-mint-cream);
    }
    .verse-container button:hover {
      background-color: var(--color-primary-bright-pink-darker-one);
      border-color: var(--color-primary-bright-pink-darker-two);
    }
    .verse-container button:active {
      scale: 95% 95%;
      transition-property: scale;
      transition-timing-function: ease-out;
      transition-duration: 0.3s;
    }
    .verse-container button:focus-visible {
      text-decoration: underline;
    }
  `;

  #renderButtonGroup(verses: string[]) {
    return verses.map((verse) => {
      const classes = { active: this.verseReference === verse };
      return html`
        <button
          type="button"
          class=${classMap(classes)}
          @click=${this.#handleVerseButtonClick}
        >
          ${verse}
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

        <span slot="page-description">
          <p>Pick and practice a verse for sharing the gospel.</p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <div class="page-content" slot="page-content">
          <ol>
            <li>
              All have sinned
              <div class="verse-container">
                ${this.#renderButtonGroup([
                  "Romans 3:23",
                  "Romans 6:23",
                  "Ecclesiastes 7:20",
                  "Isaiah 53:6",
                ])}
              </div>
            </li>
            <li>
              Jesus paid the penalty for our sins
              <div class="verse-container">
                ${this.#renderButtonGroup([
                  "Romans 5:8",
                  "2 Corinthians 5:21",
                  "1 Peter 3:18",
                  "Romans 5:19",
                ])}
              </div>
            </li>
            <li>
              Believe in Jesus and be saved
              <div class="verse-container">
                ${this.#renderButtonGroup([
                  "Ephesians 2:8-9",
                  "John 3:16-17",
                  "John 14:6",
                  "Romans 10:9",
                ])}
              </div>
            </li>
          </ol>

          <bible-translation-drop-down-list
            bible-id=${this.bibleId}
          ></bible-translation-drop-down-list>

          <bible-verse-fetch-result
            verse-reference=${this.verseReference}
            bible-id=${this.bibleId}
            ?visible=${this.visible}
          ></bible-verse-fetch-result>
        </div>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleVerseButtonClick(event: Event) {
    const selectedButtonElement = event.target as HTMLButtonElement;
    this.verseReference = selectedButtonElement.innerText.trim();
    selectedButtonElement.closest("li")?.scrollIntoView();
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage:
        WEB_COMPONENT_PAGES.SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE,
    });
  }
}

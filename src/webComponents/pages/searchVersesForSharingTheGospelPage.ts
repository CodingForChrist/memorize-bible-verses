import { BasePage } from "./basePage";
import { CUSTOM_EVENTS } from "../../constants";

import type { CustomEventNavigateToPage } from "../../types";

export class SearchVersesForSharingTheGospelPage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [...BasePage.observedAttributes, "bible-id"];
  }

  get pageTitle() {
    return "︎Verses for Sharing the Gospel | Memorize Bible Verses";
  }

  get #bibleTranslationSelectorElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-selector",
    ) as HTMLElement;
  }

  get #bibleVerseListElement() {
    return this.shadowRoot!.querySelector("bible-verse-list") as HTMLElement;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <h1>Search</h1>

      <p>Pick and practice a verse for sharing the gospel.</p>
      <p>When you have the verse memorized go to Step 2.</p>

      <div class="search-container">
        <bible-translation-selector></bible-translation-selector>
        <bible-verse-list verses="Romans 3:23,Romans 6:23,Romans 5:8,Ephesians 2:8-9"></bible-verse-list>
      </div>

      <div class="page-navigation">
        <branded-button id="button-back" type="button" brand="secondary" text-content="< Back"></branded-button>
        <branded-button id="button-forward" type="button" text-content="Step 2 >"></branded-button>
      </div>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        margin: 1rem auto;
        text-align: center;
        max-width: 28rem;
        display: block;
      }
      h1 {
        font-family: var(--font-heading);
        font-size: 2rem;
        margin: 2rem 0;

        @media (width >= 40rem) {
          font-size: 2.5rem;
        }
      }
      p {
        margin: 0 2.5rem 1rem 2.5rem;
      }
      bible-translation-selector {
        margin-bottom: 1.5rem;
      }
      .search-container {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        text-align: left;
        min-height: 16rem;
        margin: 2rem 0;
        padding: 1.5rem 1rem;

        @media (width >= 28rem) {
          margin: 2rem 1rem;
          padding: 1.5rem;
        }
      }
      .page-navigation {
        margin: 2rem 0;
        display: flex;
        justify-content: space-between;

        @media (width >= 28rem) {
          margin: 2rem 1rem;
        }
      }
      .page-navigation branded-button {
        min-width: 6rem;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  #navigateToPreviousPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "search-options-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #navigateToNextPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "speak-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => this.#navigateToPreviousPage(),
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => this.#navigateToNextPage(),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "bible-id") {
      this.#bibleTranslationSelectorElement?.setAttribute(name, newValue);
      this.#bibleVerseListElement?.setAttribute(name, newValue);
    }
  }
}

window.customElements.define(
  "search-verses-for-sharing-the-gospel-page",
  SearchVersesForSharingTheGospelPage,
);

import { BasePage } from "./basePage";
import { CUSTOM_EVENTS } from "../../constants";

import type {
  CustomEventNavigateToPage,
  CustomEventUpdateBibleVerse,
} from "../../types";

export class SearchOptionsPage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [...BasePage.observedAttributes];
  }

  get pageTitle() {
    return "Search Options | Memorize Bible Verses";
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <h1>Search</h1>

      <p>Choose to memorize verses from the options below.</p>

      <div class="buttons-container">
        <button id="button-awana-discovery-of-grace" type="button">Awana: Discovery of Grace</button>
        <button id="button-share-the-gospel" type="button">Share the Gospel</button>
        <button id="button-psalm-23" type="button">Psalm 23</button>
        <button id="button-power-user" type="button">Power User: Choose Your Verses</button>
      </div>

      <div class="page-navigation">
        <branded-button id="button-back" type="button" brand="secondary">
          <span slot="button-text">&lt; Back</span>
        </branded-button>
        <branded-button id="button-forward" type="button">
          <span slot="button-text">Step 1 &gt;</span>
        </branded-button>
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
        font-weight: 400;
        margin: 2rem 0;

        @media (width >= 40rem) {
          font-size: 2.5rem;
        }
      }
      p {
        margin: 0 2.5rem 1rem 2.5rem;
      }
      .buttons-container {
        margin-top: 2rem;

        @media (width >= 28rem) {
          margin-left: 1rem;
          margin-right: 1rem;
        }
      }
      button {
        font-size: 1.25rem;
        font-family: var(--font-heading);
        line-height: 1.5rem;
        text-transform: uppercase;
        padding: 1rem;
        cursor: pointer;
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: 1.5rem;
        background-color: var(--color-primary-bright-pink);
        color: var(--color-primary-mint-cream);
        margin-bottom: 1.25rem;
      }
      button:hover {
        filter: brightness(85%);
      }
      #button-awana-discovery-of-grace {
        background-color: var(--color-secondary-blue-green);
      }
      #button-share-the-gospel {
        background-color: var(--color-primary-bright-pink);
      }
      #button-psalm-23 {
        background-color: var(--color-secondary-ut-orange);
      }
      #button-power-user {
        background-color: var(--color-secondary-jade);
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

  #navigateToSearchAdvancedPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "search-advanced-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #navigateToAwanaDiscoveryOfGracePage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: {
            pageName: "search-verses-for-awana-discovery-of-grace-page",
          },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #navigateToShareTheGospelPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "search-verses-for-sharing-the-gospel-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #navigateToPsalm23Page() {
    const bibleVersePsalm23 = {
      id: "",
      reference: "Psalm 23:1-6",
      content: "",
    };

    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventUpdateBibleVerse>(
        CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
        {
          detail: { bibleVerse: bibleVersePsalm23 },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBible);

    this.#navigateToSearchAdvancedPage();
  }

  #navigateToPreviousPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "instructions-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #navigateToNextPage() {
    this.#navigateToSearchAdvancedPage();
  }

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot!.querySelector(
      "#button-awana-discovery-of-grace",
    )?.addEventListener("click", () =>
      this.#navigateToAwanaDiscoveryOfGracePage(),
    );

    this.shadowRoot!.querySelector(
      "#button-share-the-gospel",
    )?.addEventListener("click", () => this.#navigateToShareTheGospelPage());

    this.shadowRoot!.querySelector("#button-psalm-23")?.addEventListener(
      "click",
      () => this.#navigateToPsalm23Page(),
    );

    this.shadowRoot!.querySelector("#button-power-user")?.addEventListener(
      "click",
      () => this.#navigateToSearchAdvancedPage(),
    );

    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => this.#navigateToPreviousPage(),
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => this.#navigateToNextPage(),
    );
  }
}

window.customElements.define("search-options-page", SearchOptionsPage);

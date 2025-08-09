import { CUSTOM_EVENTS } from "../../constants";

import type { CustomEventNavigateToPage } from "../../types";

export class SearchAdvancedPage extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <h1>Search</h1>

      <p>Power Users can enter specific verses. <br> Simply type in the book, chapter number
      and verse number you wish to learn. Then practice the verse.</p>
      <p>When you have the verse memorized go to Step 2.</p>

      <div class="search-container">
        <bible-translation-selector></bible-translation-selector>
        <bible-verse-selector></bible-verse-selector>
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
        margin-bottom: 2rem;
      }
      .search-container {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        padding: 1.5rem;
        text-align: left;
        min-height: 20rem;
        margin: 2rem 1rem;
      }
      .page-navigation {
        margin: 2rem 1rem;
        display: flex;
        justify-content: space-between;
      }
      .page-navigation branded-button {
        min-width: 6rem;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => {
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
      },
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => {
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
      },
    );
  }
}

window.customElements.define("search-advanced-page", SearchAdvancedPage);

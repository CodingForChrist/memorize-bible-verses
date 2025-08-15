import { CUSTOM_EVENTS } from "../../constants";

import type { CustomEventNavigateToPage } from "../../types";

export class SpeakPage extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["verse-id", "verse-reference", "verse-content"];
  }

  get #reciteBibleVerseElement() {
    return this.shadowRoot!.querySelector("recite-bible-verse") as HTMLElement;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <h1>Speak</h1>

      <p>When you are ready, press Record. Speak the entire verse clearly and slowly—then press stop.
      Don't worry if you make a mistake, you can record again.</p>
      <p>Once you have a recording you like go to Step 3 and get your score.</p>

      <div class="search-container">
        <recite-bible-verse></recite-bible-verse>
      </div>

      <div class="page-navigation">
        <branded-button id="button-back" type="button" brand="secondary" text-content="< Back"></branded-button>
        <branded-button id="button-forward" type="button" text-content="Step 3 >"></branded-button>
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
      .search-container {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        padding: 1.5rem;
        text-align: left;
        min-height: 16rem;
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

  #navigateToPreviousPage() {
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

  #navigateToNextPage() {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageName: "score-page" },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  connectedCallback() {
    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => this.#navigateToPreviousPage(),
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => this.#navigateToNextPage(),
    );
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    for (const attributeName of SpeakPage.observedAttributes) {
      if (name === attributeName) {
        this.#reciteBibleVerseElement?.setAttribute(attributeName, newValue);
      }
    }
  }
}

window.customElements.define("speak-page", SpeakPage);

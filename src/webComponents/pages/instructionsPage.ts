import { CUSTOM_EVENTS } from "../../constants";
import logoURL from "../../images/logo.svg";

import type { CustomEventNavigateToPage } from "../../types";

export class InstructionsPage extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <header>
        <img src="${logoURL}" alt="Memorize Bible Verses" />
      </header>
      <h2>Search</h2>
      <p>
        Choose from a collection of verses or enter verses you want to learn
      </p>

      <h2>Speak</h2>
      <p>Record yourself reciting the verse from memory</p>

      <h2>Score</h2>
      <p>Find out how well you have each verse memorized</p>

      <branded-button type="button" text-content="Get Started"></branded-button>
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
        padding: 0 2.5rem;
        display: block;
      }
      header {
        text-align: center;
      }

      header img {
        margin-top: 0.75rem;
        margin-bottom: 1.5rem;
        width: 12rem;

        @media (width >= 40rem) {
          margin-bottom: 2rem;
          width: 14rem;
        }

        @media (width >= 64rem) {
          margin-bottom: 2.25rem;
          width: 16rem;
        }
      }
      h2 {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        margin: 0;

        @media (width >= 40rem) {
          font-size: 1.6rem;
        }
      }
      p {
        margin-top: 0;
        margin-bottom: 2rem;
      }
      branded-button {
        margin-top: 1rem;
        min-width: 10rem;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector("branded-button")?.addEventListener(
      "click",
      () => {
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
      },
    );
  }
}

window.customElements.define("instructions-page", InstructionsPage);

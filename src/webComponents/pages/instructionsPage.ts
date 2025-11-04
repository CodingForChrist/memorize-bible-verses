import { BasePage } from "./basePage";
import { WEB_COMPONENT_PAGES } from "../../constants";
import logoURL from "../../images/logo.svg";

export class InstructionsPage extends BasePage {
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
    return "︎Instructions | Memorize Bible Verses";
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

      <branded-button type="button">
        <span slot="button-text">Get Started</span>
      </branded-button>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        margin: 1rem auto;
        text-align: center;
        max-width: 24rem;
        padding: 0 2.5rem;
        display: block;
      }
      header {
        text-align: center;
      }

      header img {
        margin-bottom: 1.5rem;
        width: 10rem;

        @media (width >= 20rem) {
          width: 12rem;
        }

        @media (width >= 40rem) {
          margin-bottom: 2rem;
          width: 14rem;
        }
      }
      h2 {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        font-weight: 400;
        margin: 0;

        @media (width >= 40rem) {
          font-size: 1.6rem;
        }
      }
      p {
        margin-top: 0;
        margin-bottom: 2rem;
        text-wrap: balance;
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
    super.connectedCallback();

    this.shadowRoot!.querySelector("branded-button")?.addEventListener(
      "click",
      () =>
        this.navigateToPage({
          nextPage: WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE,
        }),
    );
  }
}

window.customElements.define(
  WEB_COMPONENT_PAGES.INSTRUCTIONS_PAGE,
  InstructionsPage,
);

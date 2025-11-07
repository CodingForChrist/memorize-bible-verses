import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

import { BasePage } from "./basePageMixin";
import { WEB_COMPONENT_PAGES } from "../../constants";
import logoURL from "../../images/logo.svg";

@customElement(WEB_COMPONENT_PAGES.INSTRUCTIONS_PAGE)
export class InstructionsPage extends BasePage(LitElement) {
  pageTitle = "︎Instructions";

  static styles = css`
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

  render() {
    return html`
      <header>
        <img src=${logoURL} alt="Memorize Bible Verses" />
      </header>
      <h2>Search</h2>
      <p>
        Choose from a collection of verses or enter verses you want to learn
      </p>

      <h2>Speak</h2>
      <p>Record yourself reciting the verse from memory</p>

      <h2>Score</h2>
      <p>Find out how well you have each verse memorized</p>

      <branded-button
        type="button"
        @click=${() =>
          this.navigateToPage({
            nextPage: WEB_COMPONENT_PAGES.SEARCH_OPTIONS_PAGE,
          })}
      >
        <span slot="button-text">Get Started</span>
      </branded-button>
    `;
  }
}

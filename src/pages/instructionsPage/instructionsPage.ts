import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

import { BasePage } from "../basePageMixin";
import { PAGE_NAME } from "../../constants";
import { buttonStyles } from "../../components/sharedStyles";
import logoURL from "../../images/logo.svg";

@customElement("instructions-page")
export class InstructionsPage extends BasePage(LitElement) {
  pageTitle = "︎Instructions";

  static styles = [
    buttonStyles,
    css`
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
      button {
        margin-top: 1rem;
        min-width: 10rem;
      }
    `,
  ];

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

      <button
        type="button"
        class="primary"
        @click=${() =>
          this.navigateToPage({
            nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE,
          })}
      >
        Get Started
      </button>
    `;
  }
}

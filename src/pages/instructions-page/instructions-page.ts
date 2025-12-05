import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { breakpointsREM, buttonStyles } from "../../components/shared-styles";
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
        padding: 0 1rem;
        display: block;

        @media (width >= ${breakpointsREM.large}rem) {
          max-width: none;
        }
      }
      header {
        text-align: center;
      }

      header img {
        margin-bottom: 2rem;
        width: 10rem;

        @media (width >= ${breakpointsREM.large}rem) {
          margin: 1rem 0 2rem;
          width: 14rem;
        }
      }
      h2 {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        font-weight: 400;
        margin: 0;

        @media (width >= ${breakpointsREM.large}rem) {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }
      }
      p {
        margin: 0;
        text-wrap: balance;
      }
      button {
        margin-top: 3rem;
        min-width: 12rem;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @media (width >= ${breakpointsREM.large}rem) {
          flex-direction: row;
          margin: 2.5rem 0;
        }
      }
      .column {
        @media (width >= ${breakpointsREM.large}rem) {
          width: 33.33%;
        }
      }
    `,
  ];

  render() {
    return html`
      <header>
        <img src=${logoURL} alt="Memorize Bible Verses" />
      </header>
      <div class="row">
        <div class="column">
          <h2>Search</h2>
          <p>
            Choose from a collection of verses or enter verses you want to learn
          </p>
        </div>
        <div class="column">
          <h2>Speak</h2>
          <p>
            Record yourself reciting the verse or typing in the verse from
            memory
          </p>
        </div>
        <div class="column">
          <h2>Score</h2>
          <p>
            Can you get a perfect score? Find out how well you know each verse
          </p>
        </div>
      </div>
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

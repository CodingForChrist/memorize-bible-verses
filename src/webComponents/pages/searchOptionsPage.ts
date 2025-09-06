import { BasePage } from "./basePage";

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
        <button id="button-awana-truth-and-training" type="button">Awana Truth and Training</button>
        <button id="button-awana-sparks" type="button">Awana Sparks</button>
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
        margin: 0 2.5rem 1rem;
      }
      .buttons-container {
        margin-top: 2rem;

        @media (width >= 28rem) {
          margin-left: 1rem;
          margin-right: 1rem;
        }
      }
      button {
        --button-background-color: var(--color-primary-bright-pink);
        --button-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);
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
        background-color: var(--button-background-color);
        color: var(--color-primary-mint-cream);
        margin-bottom: 1.25rem;
      }
      button:hover {
        filter: brightness(85%);
      }
      button:focus-visible {
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(var(--button-box-shadow-color-rgb), 0.5);
      }
      #button-awana-truth-and-training {
        --button-background-color: var(--color-secondary-blue-green);
        --button-box-shadow-color-rgb: var(--color-secondary-blue-green-rgb);
      }
      #button-awana-sparks {
        --button-background-color: var(--color-primary-bright-pink);
        --button-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
      #button-share-the-gospel {
        --button-background-color: var(--color-secondary-ut-orange);
        --button-box-shadow-color-rgb: var(--color-secondary-ut-orange-rgb);
      }
      #button-psalm-23 {
        --button-background-color: var(--color-secondary-jade);
        --button-box-shadow-color-rgb: var(--color-secondary-jade-rgb);
      }
      #button-power-user {
        --button-background-color: var(--color-secondary-cerulean);
        --button-box-shadow-color-rgb: var(--color-secondary-cerulean-rgb);
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

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot!.querySelector(
      "#button-awana-truth-and-training",
    )?.addEventListener("click", () =>
      this.navigateToPage({
        nextPage: "search-verses-for-awana-truth-and-training-page",
      }),
    );

    this.shadowRoot!.querySelector("#button-awana-sparks")?.addEventListener(
      "click",
      () =>
        this.navigateToPage({
          nextPage: "search-verses-for-awana-sparks-page",
        }),
    );

    this.shadowRoot!.querySelector(
      "#button-share-the-gospel",
    )?.addEventListener("click", () =>
      this.navigateToPage({
        nextPage: "search-verses-for-sharing-the-gospel-page",
      }),
    );

    this.shadowRoot!.querySelector("#button-psalm-23")?.addEventListener(
      "click",
      () =>
        this.navigateToPage({
          nextPage: "search-psalm-23-page",
        }),
    );

    this.shadowRoot!.querySelector("#button-power-user")?.addEventListener(
      "click",
      () => this.navigateToPage({ nextPage: "search-advanced-page" }),
    );

    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => this.navigateToPage({ nextPage: "instructions-page" }),
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => this.navigateToPage({ nextPage: "search-advanced-page" }),
    );
  }
}

window.customElements.define("search-options-page", SearchOptionsPage);

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
        <branded-button id="button-awana-truth-and-training" type="button">
          <span slot="button-text">Awana Truth and Training</span>
        </branded-button>
        <branded-button id="button-awana-sparks" type="button">
          <span slot="button-text">Awana Sparks</span>
        </branded-button>
        <branded-button id="button-share-the-gospel" type="button">
          <span slot="button-text">Share the Gospel</span>
        </branded-button>
        <branded-button id="button-psalm-23" type="button">
          <span slot="button-text">Psalm 23</span>
        </branded-button>
        <branded-button id="button-power-user" type="button">
          <span slot="button-text">Power User: Choose Your Verses</span>
        </branded-button>
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
      .buttons-container branded-button {
        --base-padding: 1rem;
        display: block;
        font-size: 1.25rem;
        font-family: var(--font-heading);
        margin-bottom: 1.25rem;
      }

      #button-awana-truth-and-training {
        --primary-background-color: var(--color-secondary-blue-green);
        --primary-box-shadow-color-rgb: var(--color-secondary-blue-green-rgb);
        --primary-background-color-hover: var(--color-secondary-blue-green-darker-one);
        --primary-border-color-hover: var(--color-secondary-blue-green-darker-two);
      }
      #button-awana-sparks {
        --primary-background-color: var(--color-primary-bright-pink);
        --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        --primary-background-color-hover: var(--color-primary-bright-pink-darker-one);
        --primary-border-color-hover: var(--color-primary-bright-pink-darker-two);
      }
      #button-share-the-gospel {
        --primary-background-color: var(--color-secondary-ut-orange);
        --primary-box-shadow-color-rgb: var(--color-secondary-ut-orange-rgb);
        --primary-background-color-hover: var(--color-secondary-ut-orange-darker-one);
        --primary-border-color-hover: var(--color-secondary-ut-orange-darker-two);
      }
      #button-psalm-23 {
        --primary-background-color: var(--color-secondary-jade);
        --primary-box-shadow-color-rgb: var(--color-secondary-jade-rgb);
        --primary-background-color-hover: var(--color-secondary-jade-darker-one);
        --primary-border-color-hover: var(--color-secondary-jade-darker-two);
      }
      #button-power-user {
        --primary-background-color: var(--color-secondary-cerulean);
        --primary-box-shadow-color-rgb: var(--color-secondary-cerulean-rgb);
        --primary-background-color-hover: var(--color-secondary-cerulean-darker-one);
        --primary-border-color-hover: var(--color-secondary-cerulean-darker-two);
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

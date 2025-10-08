export class VerseTextPageTemplate extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const templateContent = this.#templateElement.content;

    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  get #templateElement() {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = `
      <h1><slot name="page-heading">PAGE HEADING MISSING</slot></h1>

      <div class="page-description">
        <slot name="page-description">PAGE DESCRIPTION MISSING</slot>
      </div>

      <div class="search-container">
        <slot name="page-content">PAGE CONTENT MISSING</slot>
      </div>

      <div class="page-navigation">
        <branded-button id="button-back" type="button" brand="secondary">
          <span slot="button-text">
            <slot name="page-navigation-back-button">
              PAGE NAVIGATION BACK BUTTON MISSING
            </slot>
          </span>
        </branded-button>
        <branded-button id="button-forward" type="button">
          <span slot="button-text">
            <slot name="page-navigation-forward-button">
              PAGE NAVIGATION FORWARD BUTTON MISSING
            </slot>
          </span>
        </branded-button>
      </div>
    `;

    return templateElement;
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
      .page-description {
        margin: 0 1.5rem 1rem;

        @media (width >= 28rem) {
          margin: 0 2.5rem 1rem;
        }
      }
      .search-container {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        text-align: left;
        min-height: 16rem;
        margin: 2rem 0;
        padding: 1.5rem 1rem;

        @media (width >= 28rem) {
          margin: 2rem 1rem;
          padding: 1.5rem;
        }
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
    this.shadowRoot!.querySelector("#button-back")?.addEventListener(
      "click",
      () => {
        this.dispatchEvent(new Event("page-navigation-back-button-click"));
      },
    );

    this.shadowRoot!.querySelector("#button-forward")?.addEventListener(
      "click",
      () => {
        this.dispatchEvent(new Event("page-navigation-forward-button-click"));
      },
    );
  }
}

window.customElements.define("verse-text-page-template", VerseTextPageTemplate);

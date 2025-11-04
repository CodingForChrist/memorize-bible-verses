import { BasePage } from "./basePage";

export class TypeVerseFromMemoryPage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [
      ...BasePage.observedAttributes,
      "verse-id",
      "verse-reference",
      "verse-content",
    ];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get pageTitle() {
    return `Type ${this.verseReference ?? ""} | Memorize Bible Verses`;
  }

  get previousPage() {
    return this.getAttribute("previous-page") ?? "search-advanced-page";
  }

  #renderDynamicContent() {
    const dynamicPageContentContainerElement = this.shadowRoot!.querySelector(
      "#dynamic-page-content-container",
    );

    if (!dynamicPageContentContainerElement) {
      return;
    }

    if (!this.verseReference) {
      dynamicPageContentContainerElement.innerHTML = `
        <alert-message type="danger">
          <span slot="alert-message">Go back to Step 1 and select a bible verse.</span>
        </alert-message>
      `;
      return;
    }

    dynamicPageContentContainerElement.innerHTML = `
        <h2>${this.verseReference}</h2>
        <type-bible-verse-from-memory
          verse-reference="${this.verseReference}">
        </type-bible-verse-from-memory>
      `;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Type</span>

        <span slot="page-description">
          <p>Type in the verse below from memory.</p>
          <p>When you are finished go to Step 3.</p>
        </span>

        <span slot="page-content">
          <span id="dynamic-page-content-container"></span>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 3 &gt;</span>
      </verse-text-page-template>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      p {
        margin: 1rem 0;
        text-wrap: balance;
      }
      h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        font-weight: 400;
        text-align: center;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    super.connectedCallback();

    this.#renderDynamicContent();

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-back-button-click", () =>
      this.navigateToPage({ nextPage: this.previousPage }),
    );

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-forward-button-click", () =>
      this.navigateToPage({
        nextPage: "score-page",
        previousPage: "type-verse-from-memory-page",
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "verse-reference" && newValue) {
      this.#renderDynamicContent();
    }
  }
}

window.customElements.define(
  "type-verse-from-memory-page",
  TypeVerseFromMemoryPage,
);

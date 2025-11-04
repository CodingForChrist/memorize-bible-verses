import { BasePage } from "./basePage";

export class ScorePage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [
      ...BasePage.observedAttributes,
      "bible-id",
      "verse-id",
      "verse-reference",
      "verse-content",
      "recited-bible-verse",
    ];
  }

  get pageTitle() {
    const verseReference = this.getAttribute("verse-reference") ?? "";
    return `Score ${verseReference} | Memorize Bible Verses`;
  }

  get previousPage() {
    return this.getAttribute("previous-page") ?? "speak-page";
  }

  get #accuracyReportElement() {
    return this.shadowRoot!.querySelector("accuracy-report") as HTMLElement;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Score</span>

        <span slot="page-description">
          <p>Your results are below.</p>
        </span>

        <span slot="page-content">
          <accuracy-report></accuracy-report>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">New Verse</span>
      </verse-text-page-template>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      p {
        margin: 1rem 0;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  #navigateToNextPage() {
    // do a full page redirect to clear out state
    window.location.href = "/memorize-bible-verses/?page=search-options-page";
  }

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-back-button-click", () =>
      this.navigateToPage({ nextPage: this.previousPage }),
    );

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-forward-button-click", () =>
      this.#navigateToNextPage(),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of ScorePage.observedAttributes) {
      if (name === attributeName) {
        this.#accuracyReportElement?.setAttribute(attributeName, newValue);
      }
    }
  }
}

window.customElements.define("score-page", ScorePage);

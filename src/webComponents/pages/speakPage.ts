import { BasePage } from "./basePage";

export class SpeakPage extends BasePage {
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
    return `Speak ${this.verseReference ?? ""} | Memorize Bible Verses`;
  }

  get previousPage() {
    return this.getAttribute("previous-page") ?? "search-advanced-page";
  }

  get #reciteBibleVerseElement() {
    return this.shadowRoot!.querySelector("recite-bible-verse") as HTMLElement;
  }

  #updateVerseReferenceHeading(verseReference: string) {
    const container = this.shadowRoot!.querySelector(
      "#verse-reference-heading-container",
    ) as HTMLElement;
    container.innerHTML = `<h2>${verseReference}</h2>`;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Speak</span>

        <span slot="page-description">
          <p>When you are ready, press Record. Speak the entire verse clearly and slowly—then press stop.
          Don't worry if you make a mistake, you can record again.</p>
          <p>Once you have a recording you like go to Step 3 and get your score.</p>
        </span>

        <span slot="page-content">
          <div id="verse-reference-heading-container"></div>
          <recite-bible-verse></recite-bible-verse>
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

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-back-button-click", () =>
      this.navigateToPage({ nextPage: this.previousPage }),
    );

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-forward-button-click", () =>
      this.navigateToPage({ nextPage: "score-page" }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of SpeakPage.observedAttributes) {
      if (name === attributeName) {
        this.#reciteBibleVerseElement?.setAttribute(attributeName, newValue);
      }
    }

    if (name === "verse-reference" && newValue) {
      this.#updateVerseReferenceHeading(newValue);
    }
  }
}

window.customElements.define("speak-page", SpeakPage);

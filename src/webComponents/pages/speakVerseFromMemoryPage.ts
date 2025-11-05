import { BasePage } from "./basePage";
import { WEB_COMPONENT_PAGES } from "../../constants";

export class SpeakVerseFromMemoryPage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [...BasePage.observedAttributes, "verse-reference", "verse-content"];
  }

  get verseReference() {
    return this.getAttribute("verse-reference");
  }

  get verseContent() {
    return this.getAttribute("verse-content");
  }

  get pageTitle() {
    return `Speak ${this.verseReference ?? ""} | Memorize Bible Verses`;
  }

  get previousPage() {
    return (
      this.getAttribute("previous-page") ??
      WEB_COMPONENT_PAGES.SEARCH_ADVANCED_PAGE
    );
  }

  #renderDynamicContent() {
    const dynamicPageContentContainerElement = this.shadowRoot!.querySelector(
      "#dynamic-page-content-container",
    );

    if (!dynamicPageContentContainerElement) {
      return;
    }

    if (!this.verseReference || !this.verseContent) {
      dynamicPageContentContainerElement.innerHTML = `
        <alert-message type="danger">
          <span slot="alert-message">Go back to Step 1 and select a bible verse.</span>
        </alert-message>
      `;
      return;
    }

    if (!this.#hasSupportForSpeechRecognition) {
      dynamicPageContentContainerElement.innerHTML = `
        <h2>${this.verseReference}</h2>
        <alert-message type="danger">
          <span slot="alert-message">
          Your browser does not support the Web Speech API.
          Please try another browser like Chrome or Safari.
          </span>
        </alert-message>
        <branded-button brand="secondary" id="button-fallback">
          <span slot="button-text">Click here to type in the verse instead
          </span>
        </branded-button>
      `;

      dynamicPageContentContainerElement
        .querySelector("#button-fallback")
        ?.addEventListener("click", () =>
          this.navigateToPage({
            nextPage: WEB_COMPONENT_PAGES.TYPE_VERSE_FROM_MEMORY_PAGE,
            previousPage: this.previousPage,
          }),
        );

      return;
    }

    dynamicPageContentContainerElement.innerHTML = `
      <h2>${this.verseReference}</h2>
      <recite-bible-verse
        verse-reference="${this.verseReference}"
        verse-content="${this.verseContent}"
        >
      </recite-bible-verse>
    `;
  }

  get #hasSupportForSpeechRecognition() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
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
      #button-fallback {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        margin-top: 3rem;
        width: 100%;
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
        nextPage: WEB_COMPONENT_PAGES.SCORE_PAGE,
        previousPage: WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (["verse-reference", "verse-content"].includes(name) && newValue) {
      this.#renderDynamicContent();
    }
  }
}

window.customElements.define(
  WEB_COMPONENT_PAGES.SPEAK_VERSE_FROM_MEMORY_PAGE,
  SpeakVerseFromMemoryPage,
);

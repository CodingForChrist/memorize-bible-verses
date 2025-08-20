import { BasePage } from "./basePage";

export class SearchVersesForSharingTheGospelPage extends BasePage {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#containerElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return [...BasePage.observedAttributes, "bible-id"];
  }

  get pageTitle() {
    return "︎Verses for Sharing the Gospel | Memorize Bible Verses";
  }

  get #bibleTranslationSelectorElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-selector",
    ) as HTMLElement;
  }

  get #bibleVerseListElement() {
    return this.shadowRoot!.querySelector("bible-verse-list") as HTMLElement;
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Pick and practice a verse for sharing the gospel.</p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-selector></bible-translation-selector>
          <bible-verse-list verses="Romans 3:23,Romans 6:23,Romans 5:8,Ephesians 2:8-9"></bible-verse-list>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;

    return divElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      bible-translation-selector {
        margin-bottom: 1.5rem;
      }
      p {
        margin: 1rem 0;
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
      this.navigateToPage({ nextPage: "search-options-page" }),
    );

    this.shadowRoot!.querySelector(
      "verse-text-page-template",
    )?.addEventListener("page-navigation-forward-button-click", () =>
      this.navigateToPage({
        nextPage: "speak-page",
        previousPage: "search-verses-for-sharing-the-gospel-page",
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "bible-id") {
      this.#bibleTranslationSelectorElement?.setAttribute(name, newValue);
      this.#bibleVerseListElement?.setAttribute(name, newValue);
    }
  }
}

window.customElements.define(
  "search-verses-for-sharing-the-gospel-page",
  SearchVersesForSharingTheGospelPage,
);

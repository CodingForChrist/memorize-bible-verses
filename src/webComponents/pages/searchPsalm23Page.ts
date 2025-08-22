import { BasePage } from "./basePage";

export class SearchPsalm23Page extends BasePage {
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
    return "︎Psalm 23 | Memorize Bible Verses";
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get #bibleTranslationSelectorElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-drop-down-list",
    ) as HTMLElement;
  }

  get #bibleVerseFetchResultElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-fetch-result",
    ) as HTMLElement;
  }

  get #pageContentElement() {
    return this.shadowRoot!.querySelector(".page-content") as HTMLElement;
  }

  #renderVerse() {
    this.#pageContentElement
      .querySelector("bible-verse-fetch-result")
      ?.remove();
    const bibleVerseFetchResultElement = document.createElement(
      "bible-verse-fetch-result",
    );
    bibleVerseFetchResultElement.setAttribute(
      "verse-reference",
      "Psalm 23:1-6",
    );
    bibleVerseFetchResultElement.setAttribute(
      "should-display-section-headings",
      "true",
    );

    bibleVerseFetchResultElement.setAttribute(
      "bible-id",
      this.bibleId ?? "",
    );

    this.#pageContentElement.appendChild(bibleVerseFetchResultElement);
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Practice memorizing Psalm 23.</p>
          <p>When you have it memorized go to Step 2.</p>
        </span>

        <span class="page-content" slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>
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
        previousPage: "search-psalm-23-page",
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "bible-id") {
      this.#bibleTranslationSelectorElement?.setAttribute(name, newValue);
      return this.#bibleVerseFetchResultElement?.setAttribute(name, newValue);
    }

    if (name === "is-visible" && newValue === "true") {
      this.#bibleTranslationSelectorElement?.setAttribute(name, newValue);
      this.#renderVerse();
    }
  }
}

window.customElements.define("search-psalm-23-page", SearchPsalm23Page);

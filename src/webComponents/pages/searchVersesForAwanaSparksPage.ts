import { BasePage } from "./basePage";

export class SearchVersesForAwanaSparksPage extends BasePage {
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
    return "︎Verses for Awana Sparks (grades K-2) | Memorize Bible Verses";
  }

  get #bibleTranslationDropDownListElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-drop-down-list",
    ) as HTMLElement;
  }

  get #bibleVerseDropDownListElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-drop-down-list",
    ) as HTMLElement;
  }

  // https://store.awana.org/product/sparks-wingrunner-handbook
  get awanaBookWingRunnerBibleVerses() {
    return [
      "John 3:16",
      "1 John 4:14",
      "Psalm 147:5",
      "1 Corinthians 15:3",
      "1 Corinthians 15:4",
      "James 2:10",
      "Acts 16:31",
      "John 20:31",
      "Psalm 118:1",
      "Romans 6:23",
      "Deuteronomy 6:5",
      "Psalm 96:2",
      "Jeremiah 32:37",
      "Leviticus 19:2",
      "Proverbs 20:11",
      "Psalm 23:1-2",
      "Psalm 23:3",
      "Psalm 23:4",
      "Psalm 23:5",
      "Psalm 23:6",
      "1 Peter 5:7",
      "Mark 16:15",
      "1 Peter 1:25",
      "1 Thessalonians 5:17-18",
      "Colossians 3:23",
      "John 1:1",
      "John 1:2",
      "John 1:3",
      "Ephesians 4:32",
      "Philippians 2:14",
    ];
  }

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Pick and practice a verse for Awana Sparks.</p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>
          <bible-verse-drop-down-list verses="${this.awanaBookWingRunnerBibleVerses.join(",")}"></bible-verse-drop-down-list>
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
      bible-translation-drop-down-list {
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
        previousPage: "search-verses-for-awana-sparks-page",
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of SearchVersesForAwanaSparksPage.observedAttributes) {
      if (name === attributeName) {
        this.#bibleTranslationDropDownListElement?.setAttribute(
          attributeName,
          newValue,
        );
        this.#bibleVerseDropDownListElement?.setAttribute(
          attributeName,
          newValue,
        );
      }
    }
  }
}

window.customElements.define(
  "search-verses-for-awana-sparks-page",
  SearchVersesForAwanaSparksPage,
);

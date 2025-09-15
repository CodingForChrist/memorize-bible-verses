import { BasePage } from "./basePage";

export class SearchVersesForAwanaPage extends BasePage {
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
    return "︎Verses for Awana Club for Kids | Memorize Bible Verses";
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

  // https://store.awana.org/product/tt-mission-discovery-of-grace-kids-handbook
  get #awanaBookDiscoveryOfGraceBibleVerses() {
    return [
      "Psalm 9:10",
      "Romans 8:38-39",
      "Deuteronomy 7:9",
      "2 Peter 3:9",
      "Romans 8:28",
      "2 Timothy 1:9",
      "John 3:17",
      "1 John 4:9",
      "Mark 12:30",
      "Psalm 25:4",
      "Romans 12:2",
      "Matthew 28:19-20",
      "Luke 19:38",
      "Mark 10:45",
      "Luke 22:41-42",
      "Ephesians 5:2",
      "Matthew 28:6",
      "1 Peter 5:10",
      "Acts 1:8",
      "Galatians 5:14",
      "Psalm 16:11",
      "2 Thessalonians 3:16",
      "Ephesians 2:10",
      "Colossians 1:10",
      "1 Timothy 6:11",
      "Galatians 5:22-23",
    ];
  }
  // https://store.awana.org/product/sparks-wingrunner-handbook
  get #awanaBookWingRunnerBibleVerses() {
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
    const verses = [
      ...this.#awanaBookDiscoveryOfGraceBibleVerses,
      ...this.#awanaBookWingRunnerBibleVerses,
    ].join(",");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Pick and practice a verse for Awana.</p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>
          <bible-verse-drop-down-list verses="${verses}"></bible-verse-drop-down-list>
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
        previousPage: "search-verses-for-awana-page",
      }),
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of SearchVersesForAwanaPage.observedAttributes) {
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
  "search-verses-for-awana-page",
  SearchVersesForAwanaPage,
);

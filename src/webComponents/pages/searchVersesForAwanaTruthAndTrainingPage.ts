import { BasePage } from "./basePage";

export class SearchVersesForAwanaTruthAndTrainingPage extends BasePage {
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
    return "︎Verses for Awana T&T (grades 3-6) | Memorize Bible Verses";
  }

  get #bibleTranslationSelectorElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-drop-down-list",
    ) as HTMLElement;
  }

  get #bibleVerseListElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-drop-down-list",
    ) as HTMLElement;
  }

  get awanaBookDiscoveryOfGraceBibleVerses() {
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

  get #containerElement() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
      <verse-text-page-template>
        <span slot="page-heading">Search</span>

        <span slot="page-description">
          <p>Pick and practice a verse for Awana T&T.</p>
          <p>When you have the verse memorized go to Step 2.</p>
        </span>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>
          <bible-verse-drop-down-list verses="${this.awanaBookDiscoveryOfGraceBibleVerses.join(",")}"></bible-verse-drop-down-list>
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
        previousPage: "search-verses-for-awana-truth-and-training-page",
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
  "search-verses-for-awana-truth-and-training-page",
  SearchVersesForAwanaTruthAndTrainingPage,
);

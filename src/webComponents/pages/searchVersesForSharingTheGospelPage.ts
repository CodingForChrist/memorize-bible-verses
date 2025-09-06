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

  get #bibleTranslationDropDownListElement() {
    return this.shadowRoot!.querySelector(
      "bible-translation-drop-down-list",
    ) as HTMLElement;
  }

  get #bibleVerseFetchResultElement() {
    return this.shadowRoot!.querySelector(
      "bible-verse-fetch-result",
    ) as HTMLElement;
  }

  get #bibleVerseButtonElements() {
    return this.shadowRoot!.querySelectorAll<HTMLButtonElement>(
      ".verse-container button",
    );
  }

  #selectVerseButtonClick(buttonElement: HTMLButtonElement) {
    this.#bibleVerseFetchResultElement?.setAttribute(
      "verse-reference",
      buttonElement.innerText,
    );

    for (const nonActiveButtonElement of this.#bibleVerseButtonElements) {
      nonActiveButtonElement.classList.remove("active");
    }
    buttonElement.classList.add("active");

    this.shadowRoot!.querySelector("ol")?.scrollIntoView();
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

        <div class="page-content" slot="page-content">
          <ol>
            <li>
              All have sinned
              <p class="verse-container">
                <button type="button">Romans 3:23</button>
                <button type="button">Romans 6:23</button>
              </p>
            </li>
            <li>
              Jesus paid the penalty for our sins
              <p class="verse-container">
                <button type="button">Romans 5:8</button>
                <button type="button">2 Corinthians 5:21</button>
              </p>
            </li>
            <li>
              Believe in Jesus and be saved
              <p class="verse-container">
                <button type="button">Ephesians 2:8-9</button>
                <button type="button">John 3:16-17</button>
              </p>
            </li>
          </ol>

          <bible-translation-drop-down-list></bible-translation-drop-down-list>
          <bible-verse-fetch-result></bible-verse-fetch-result>
        </div>

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
      bible-verse-fetch-result {
        margin: 3rem 0 1.5rem;
      }
      p {
        margin: 1rem 0;
      }
      ol {
        margin: 0 0 2rem;
        padding-left: 1rem;
      }
      .page-content {
        min-height: 26rem;
      }
      .verse-container {
        margin-left: -1rem;
        margin-top: 0.25rem;
      }
      .verse-container button {
        all: unset;
        color: var(--color-primary-bright-pink);
        text-decoration: underline;
        cursor: pointer;
        padding: 0.25rem 0;
      }
      .verse-container button:first-child {
        padding-left: 1rem;
        padding-right: 0.5rem;
      }
      .verse-container button:hover,
      .verse-container button:focus,
      .verse-container button:focus-visible,
      .verse-container button:active,
      .verse-container button.active {
        outline: revert;
        outline: none;
        text-decoration: none;
        border-radius: 1.5rem;
        background-color: var(--color-primary-bright-pink);
        color: var(--color-primary-mint-cream);
        padding: 0.25rem 1rem;
      }
      .verse-container button:focus-visible {
        text-decoration: underline;
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

    for (const buttonElement of this.#bibleVerseButtonElements) {
      buttonElement.addEventListener("click", () => {
        this.#selectVerseButtonClick(buttonElement);
      });
    }

    // set first verse as active
    const firstVerseButton = this.#bibleVerseButtonElements[0];
    if (firstVerseButton) {
      this.#bibleVerseFetchResultElement.setAttribute(
        "verse-reference",
        firstVerseButton.innerText,
      );
      firstVerseButton.classList.add("active");
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    for (const attributeName of SearchVersesForSharingTheGospelPage.observedAttributes) {
      if (name === attributeName) {
        this.#bibleTranslationDropDownListElement?.setAttribute(
          attributeName,
          newValue,
        );
        this.#bibleVerseFetchResultElement?.setAttribute(
          attributeName,
          newValue,
        );
      }
    }
  }
}

window.customElements.define(
  "search-verses-for-sharing-the-gospel-page",
  SearchVersesForSharingTheGospelPage,
);

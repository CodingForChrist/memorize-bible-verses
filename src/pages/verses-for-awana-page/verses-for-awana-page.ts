import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { BasePage } from "../base-page-mixin";
import { PAGE_NAME } from "../../constants";
import { formControlStyles } from "../../components/shared-styles";
import { getStateFromURL } from "../../services/router";

import {
  getOldTestamentVerseReferences,
  getNewTestamentVerseReferences,
  sortBibleVerseReferences,
} from "./sort-bible-verses";

import "../verse-text-page-template";
import "../../components/bible-translation-drop-down-list";
import "../../components/bible-verse-fetch-result";

@customElement("verses-for-awana-page")
export class VersesForAwanaPage extends BasePage(LitElement) {
  @property({ attribute: "bible-id", reflect: true })
  bibleId?: string;

  @state()
  selectedBibleVerse = this.#verseReferenceFromQueryString ?? "";

  pageTitle = "Verses for Awana Club for Kids";

  static styles = [
    formControlStyles,
    css`
      bible-translation-drop-down-list {
        margin-bottom: 1.5rem;
      }
    `,
  ];

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

  get #allBibleVerses() {
    return [
      ...this.#awanaBookDiscoveryOfGraceBibleVerses,
      ...this.#awanaBookWingRunnerBibleVerses,
    ];
  }

  get #versesFromOldTestament() {
    const oldTestamentVerses = getOldTestamentVerseReferences(
      this.#allBibleVerses,
    );
    return sortBibleVerseReferences(oldTestamentVerses);
  }

  get #versesFromNewTestament() {
    const newTestamentVerses = getNewTestamentVerseReferences(
      this.#allBibleVerses,
    );
    return sortBibleVerseReferences(newTestamentVerses);
  }

  get #verseReferenceFromQueryString() {
    const verseReference = getStateFromURL()?.verse;

    if (verseReference && this.#allBibleVerses.includes(verseReference)) {
      return verseReference;
    }
  }

  #renderBibleVerseSelect() {
    if (!this.bibleId) {
      return;
    }

    return html`
      <select
        .value=${this.selectedBibleVerse}
        @change=${this.#handleBibleVerseSelectElementChange}
        autofocus
      >
        <option disabled value="default" ?selected=${!this.selectedBibleVerse}>
          -- select a verse --
        </option>
        <optgroup label="Old Testament">
          ${this.#versesFromOldTestament.map(
            (verse) => html`
              <option
                .value=${verse}
                ?selected=${verse === this.selectedBibleVerse}
              >
                ${verse}
              </option>
            `,
          )}
        </optgroup>

        <optgroup label="New Testament">
          ${this.#versesFromNewTestament.map(
            (verse) => html`
              <option
                .value=${verse}
                ?selected=${verse === this.selectedBibleVerse}
              >
                ${verse}
              </option>
            `,
          )}
        </optgroup>
      </select>
    `;
  }

  render() {
    return html`
      <verse-text-page-template
        @page-navigation-back-button-click=${this.#handleBackButtonClick}
        @page-navigation-forward-button-click=${this.#handleForwardButtonClick}
      >
        <span slot="page-heading">Awana Club for Kids</span>

        <p slot="page-description">Pick and practice a verse for Awana.</p>
        <p slot="page-description">
          When you have the verse memorized go to Step 2.
        </p>

        <span slot="page-content">
          <bible-translation-drop-down-list></bible-translation-drop-down-list>

          ${this.#renderBibleVerseSelect()}

          <bible-verse-fetch-result
            bible-id=${ifDefined(this.bibleId)}
            verse-reference=${ifDefined(this.selectedBibleVerse)}
          ></bible-verse-fetch-result>
        </span>

        <span slot="page-navigation-back-button">&lt; Back</span>
        <span slot="page-navigation-forward-button">Step 2 &gt;</span>
      </verse-text-page-template>
    `;
  }

  #handleBackButtonClick() {
    this.navigateToPage({ nextPage: PAGE_NAME.SEARCH_OPTIONS_PAGE });
  }

  #handleForwardButtonClick() {
    this.navigateToPage({
      nextPage: PAGE_NAME.SPEAK_VERSE_FROM_MEMORY_PAGE,
      previousPage: PAGE_NAME.VERSES_FOR_AWANA_PAGE,
    });
  }

  #handleBibleVerseSelectElementChange(event: Event) {
    this.selectedBibleVerse = (event.target as HTMLSelectElement).value;
  }
}

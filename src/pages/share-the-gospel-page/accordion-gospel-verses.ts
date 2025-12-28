import { LitElement, css, html } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

import { CollapsibleContent } from "../../components/collapsible-content";
import { breakpointsREM, buttonStyles } from "../../components/shared-styles";
import { getStateFromURL } from "../../services/router";

const accordionVerses = [
  [
    { verseReference: "Romans 3:23" },
    { verseReference: "Romans 6:23" },
    {
      verseReference: "Ecclesiastes 7:20",
      verseLabel: "Eccles. 7:20",
    },
    { verseReference: "Isaiah 53:6" },
  ],
  [
    { verseReference: "Romans 5:8" },
    {
      verseReference: "2 Corinthians 5:21",
      verseLabel: "2 Cor. 5:21",
    },
    { verseReference: "1 Peter 3:18" },
    { verseReference: "Romans 5:19" },
  ],
  [
    {
      verseReference: "Ephesians 2:8-9",
    },
    { verseReference: "John 3:16-17" },
    { verseReference: "John 14:6" },
    { verseReference: "Romans 10:9" },
  ],
];

@customElement("accordion-gospel-verses")
export class AccordionGospelVerses extends LitElement {
  @property({ type: Boolean, reflect: true })
  hidden = false;

  @state()
  selectedVerseReference =
    this.#verseReferenceFromQueryString ?? accordionVerses[0][0].verseReference;

  @queryAll("collapsible-content")
  accordionItems?: CollapsibleContent[];

  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
      }
      button.secondary {
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        text-wrap: balance;
      }
      .verse-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        row-gap: 0.5rem;
        font-size: 80%;

        @media (min-width: ${breakpointsREM.small}rem) {
          font-size: 90%;
        }
        @media (min-width: ${breakpointsREM.medium}rem) {
          font-size: 100%;
        }
        @media (min-width: ${breakpointsREM.extraLarge}rem) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      .verse-container button.secondary:active,
      .verse-container button.secondary.active {
        --secondary-color: var(--color-primary-mint-cream);
        --secondary-background-color: var(--color-primary-bright-pink);
        --secondary-border-color: var(--color-primary-bright-pink);
        --secondary-color-hover: var(--color-primary-mint-cream);
        --secondary-background-color-hover: var(
          --color-primary-bright-pink-darker-one
        );
      }
      collapsible-content:first-of-type {
        --border-top-right-radius: 1.5rem;
        --border-top-left-radius: 1.5rem;
        --border-bottom-right-radius: 0;
        --border-bottom-left-radius: 0;
      }
      collapsible-content:not(:first-of-type) {
        --border-top-right-radius: 0;
        --border-top-left-radius: 0;
        --border-bottom-right-radius: 0;
        --border-bottom-left-radius: 0;
        border-top: 0;
      }
      collapsible-content:last-of-type {
        --border-top-right-radius: 0;
        --border-top-left-radius: 0;
        --border-bottom-right-radius: 1.5rem;
        --border-bottom-left-radius: 1.5rem;
        margin-bottom: 2rem;
      }
    `,
  ];

  get #verseReferenceFromQueryString() {
    const verseReference = getStateFromURL()?.verse;
    const allVerses = accordionVerses
      .flat()
      .map(({ verseReference }) => verseReference);

    if (verseReference && allVerses.includes(verseReference)) {
      return verseReference;
    }
  }

  #hasSelectedBibleVerse(index: number) {
    const foundVerse = accordionVerses[index].find(({ verseReference }) => {
      return this.selectedVerseReference === verseReference;
    });
    return Boolean(foundVerse);
  }

  #renderButtonGroup(
    verses: { verseReference: string; verseLabel?: string }[],
  ) {
    return html`
      <div class="verse-container">
        ${map(verses, ({ verseReference, verseLabel }) => {
          const classes = {
            active: this.selectedVerseReference === verseReference,
            secondary: true,
          };
          return html`
            <button
              type="button"
              class=${classMap(classes)}
              @click=${this.#handleVerseButtonClick}
              data-verse-reference=${verseReference}
            >
              ${verseLabel ?? verseReference}
            </button>
          `;
        })}
      </div>
    `;
  }

  render() {
    if (this.hidden) {
      return;
    }
    return html`
      <collapsible-content
        title="All have sinned"
        ?expanded=${this.#hasSelectedBibleVerse(0)}
      >
        ${this.#renderButtonGroup(accordionVerses[0])}
      </collapsible-content>
      <collapsible-content
        title="Jesus paid for our sins"
        ?expanded=${this.#hasSelectedBibleVerse(1)}
      >
        ${this.#renderButtonGroup(accordionVerses[1])}
      </collapsible-content>
      <collapsible-content
        title="Believe in Jesus and be saved"
        ?expanded=${this.#hasSelectedBibleVerse(2)}
      >
        ${this.#renderButtonGroup(accordionVerses[2])}
      </collapsible-content>
    `;
  }

  firstUpdated() {
    this.#sendSelectedVerseReferenceChangeEvent();
  }

  #handleVerseButtonClick(event: Event) {
    const selectedButtonElement = event.target as HTMLButtonElement;
    const selectedAccordionItem = selectedButtonElement.closest(
      "collapsible-content",
    );
    const verseReference = selectedButtonElement.dataset.verseReference;

    if (!verseReference) {
      return;
    }
    this.selectedVerseReference = verseReference;

    this.#sendSelectedVerseReferenceChangeEvent();
    this.scrollIntoView();

    // close other open accordion items
    if (this.accordionItems) {
      for (const accordionItem of this.accordionItems) {
        if (selectedAccordionItem === accordionItem) {
          continue;
        }
        accordionItem.expanded = false;
      }
    }
  }

  #sendSelectedVerseReferenceChangeEvent() {
    if (!this.selectedVerseReference) {
      throw new Error("Failed to send event because no verse is selected");
    }

    const eventUpdateSelectedVerseReference = new CustomEvent<{
      verseReference: string;
    }>("change", {
      detail: { verseReference: this.selectedVerseReference },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateSelectedVerseReference);
  }
}

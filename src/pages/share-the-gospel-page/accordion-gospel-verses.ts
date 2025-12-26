import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { classMap } from "lit/directives/class-map.js";

import { breakpointsREM, buttonStyles } from "../../components/shared-styles";
import { getStateFromURL } from "../../services/router";

const accordionContent = [
  {
    title: "All have sinned",
    verses: [
      { verseReference: "Romans 3:23" },
      { verseReference: "Romans 6:23" },
      {
        verseReference: "Ecclesiastes 7:20",
        verseLabel: "Eccles. 7:20",
      },
      { verseReference: "Isaiah 53:6" },
    ],
  },
  {
    title: "Jesus paid for our sins",
    verses: [
      { verseReference: "Romans 5:8" },
      {
        verseReference: "2 Corinthians 5:21",
        verseLabel: "2 Cor. 5:21",
      },
      { verseReference: "1 Peter 3:18" },
      { verseReference: "Romans 5:19" },
    ],
  },
  {
    title: "Believe in Jesus and be saved",
    verses: [
      {
        verseReference: "Ephesians 2:8-9",
      },
      { verseReference: "John 3:16-17" },
      { verseReference: "John 14:6" },
      { verseReference: "Romans 10:9" },
    ],
  },
];

@customElement("accordion-gospel-verses")
export class AccordionGospelVerses extends LitElement {
  @property({ type: Boolean, reflect: true })
  hidden = false;

  @state()
  selectedVerseReference =
    this.#verseReferenceFromQueryString ??
    accordionContent[0].verses[0].verseReference;
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

  get #allBibleVerses() {
    const allBibleVerses: string[] = [];

    for (const { verses } of accordionContent) {
      for (const { verseReference } of verses) {
        allBibleVerses.push(verseReference);
      }
    }

    return allBibleVerses;
  }

  get #verseReferenceFromQueryString() {
    const verseReference = getStateFromURL()?.verse;

    if (verseReference && this.#allBibleVerses.includes(verseReference)) {
      return verseReference;
    }
  }

  #hasSelectedBibleVerse(index: number) {
    const foundVerse = accordionContent[index].verses.find(
      ({ verseReference }) => {
        return this.selectedVerseReference === verseReference;
      },
    );
    return Boolean(foundVerse);
  }

  #renderButtonGroup(
    verses: { verseReference: string; verseLabel?: string }[],
  ) {
    return verses.map(({ verseReference, verseLabel }) => {
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
    });
  }

  render() {
    if (this.hidden) {
      return;
    }

    return accordionContent.map(({ title, verses }, index) => {
      return html`
        <collapsible-content
          title=${title}
          ?expanded=${this.#hasSelectedBibleVerse(index)}
        >
          <div class="verse-container">${this.#renderButtonGroup(verses)}</div>
        </collapsible-content>
      `;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.#sendSelectedVerseReferenceChangeEvent();
  }

  #handleVerseButtonClick(event: Event) {
    const selectedButtonElement = event.target as HTMLButtonElement;
    if (!selectedButtonElement.dataset.verseReference) {
      return;
    }
    this.selectedVerseReference = selectedButtonElement.dataset.verseReference;

    this.#sendSelectedVerseReferenceChangeEvent();

    selectedButtonElement.closest("collapsible-content")?.scrollIntoView();
  }

  #sendSelectedVerseReferenceChangeEvent() {
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

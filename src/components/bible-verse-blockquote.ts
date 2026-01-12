import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";

import { hyperlinkStyles } from "./shared-styles";

import type {
  BibleVerse,
  BibleVerseContentItem,
} from "../schemas/bible-verse-schema";

@customElement("bible-verse-blockquote")
export class BibleVerseBlockquote extends LitElement {
  @property({ type: Array })
  content?: BibleVerse["content"];

  @property({
    attribute: "display-verse-numbers",
    reflect: true,
    type: Boolean,
  })
  displayVerseNumbers: boolean = false;

  @property({ attribute: "citation-text", reflect: true })
  citationText?: string;

  @property({ attribute: "citation-link", reflect: true })
  citationLink?: string;

  static styles = [
    hyperlinkStyles,
    unsafeCSS(scriptureStyles),
    css`
      :host {
        display: block;
      }
      blockquote {
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0;
      }
      .scripture-styles {
        color: var(--color-dark-gray);
        line-height: 1.5;
      }
      .citation {
        font-size: 0.75rem;
        margin-top: 3rem;
        margin-bottom: 0;
      }
      .hidden {
        display: none;
      }
    `,
  ];

  #renderItemTag({ type, name, attrs, items }: BibleVerseContentItem) {
    if (type !== "tag" || !items || !attrs?.style) {
      throw new Error('unexpected data for item type "tag"');
    }

    const { style: className = "" } = attrs;

    if (name === "para") {
      return html`<p class=${className}>${this.#renderItems(items)}</p>`;
    }

    if (name === "char" || name === "ref") {
      return html`<span class=${className}>${this.#renderItems(items)}</span>`;
    }

    if (name === "verse") {
      return this.#renderVerseNumberText({ type, items, attributes: attrs });
    }

    throw new Error(`Unexpected item type name: ${name}`);
  }

  #renderItems(items: BibleVerseContentItem[]): TemplateResult[] {
    return items.map((item, index) => {
      if (item.type === "tag") {
        return this.#renderItemTag(item);
      }
      if (item.type === "text") {
        return this.#renderItemText({ items, index });
      }
      throw new Error("Unexpected item type");
    });
  }

  #renderItemText({
    items,
    index,
  }: {
    items: BibleVerseContentItem[];
    index: number;
  }) {
    const currentItem = items[index];
    if (currentItem.type !== "text") {
      throw new Error('unexpected data for item type "text"');
    }

    const nextItem = items[index + 1] ?? {};

    if (
      currentItem.text?.endsWith(" ") ||
      nextItem.text?.startsWith(" ") ||
      nextItem.type !== "text"
    ) {
      return html`<span>${currentItem.text}</span>`;
    }

    const whiteSpace = " ";
    return html`<span>${currentItem.text}${whiteSpace}</span>`;
  }

  #renderVerseNumberText({
    type,
    items,
    attributes,
  }: {
    type: BibleVerseContentItem["type"];
    items: BibleVerseContentItem[];
    attributes: BibleVerseContentItem["attrs"];
  }) {
    if (type !== "tag" || !attributes?.style) {
      throw new Error('unexpected data for item type "tag"');
    }

    const dynamicClassName = attributes.style ?? "";
    const classes = {
      [dynamicClassName]: true,
      hidden: !this.displayVerseNumbers,
    };

    if (items.length === 1 && items[0].type === "text") {
      return html`<span class=${classMap(classes)}>${items[0].text}</span>`;
    }

    throw new Error("Unexpected format for items array for verse numbers");
  }

  #renderCitation() {
    if (!this.citationText) {
      return;
    }

    if (this.citationLink) {
      return html`
        <p class="citation">
          ${this.citationText}
          <a
            href="${this.citationLink}"
            target="_blank"
            rel="noopener noreferrer"
            >${this.citationLink}</a
          >
        </p>
      `;
    }

    return html`<p class="citation">${this.citationText}</p>`;
  }

  render() {
    if (!this.content) {
      return;
    }

    return html`
      <blockquote class="scripture-styles">
        ${map(this.content, (itemTag) => this.#renderItemTag(itemTag))}
      </blockquote>
      ${this.#renderCitation()}
    `;
  }
}

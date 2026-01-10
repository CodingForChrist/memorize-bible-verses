import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";

type BibleVerseContent = ItemTag[];

type Item = ItemTag | ItemText;

type ItemTag = {
  type: "tag";
  name: "para" | "verse" | "char";
  items: Item[];
  attrs: {
    style: string;
    number?: string;
    sid?: string;
    vid?: string;
  };
};

type ItemText = {
  type: "text";
  text: string;
  attrs?: Record<string, unknown>;
};

@customElement("bible-verse-json-to-html")
export class BibleVerseJSONToHTML extends LitElement {
  @property({ type: Array })
  content?: Record<string, unknown>[];

  @property({
    attribute: "include-verse-numbers",
    reflect: true,
    type: Boolean,
  })
  includeVerseNumbers: boolean = false;

  static styles = [
    unsafeCSS(scriptureStyles),
    css`
      :host {
        display: block;
      }
      .scripture-styles {
        color: var(--color-dark-gray);
        line-height: 1.5;
      }
      .hidden {
        display: none;
      }
    `,
  ];

  #renderItemTag({ name, attrs, items }: ItemTag) {
    const { style: className } = attrs;

    if (name === "para") {
      return html`<p class=${className}>${this.#renderItems(items)}</p>`;
    }

    if (name === "char") {
      return html`<span class=${className}>${this.#renderItems(items)}</span>`;
    }

    if (name === "verse") {
      return this.#renderVerseNumberText(items, attrs);
    }

    throw new Error(`Unexpected item type name: ${name}`);
  }

  #renderItems(items: Item[]): TemplateResult[] {
    return items.map((item) => {
      if (item.type === "tag") {
        return this.#renderItemTag(item);
      } else if (item.type === "text") {
        return this.#renderItemText(item);
      } else {
        throw new Error("Unexpected item type");
      }
    });
  }

  #renderItemText({ text }: ItemText) {
    // a trailing space is required to properly format text
    const whiteSpace = " ";
    return html`<span>${text}${whiteSpace}</span>`;
  }

  #renderVerseNumberText(items: Item[], attributes: ItemTag["attrs"]) {
    const classes = {
      [attributes.style]: true,
      hidden: !this.includeVerseNumbers,
    };

    if (items.length === 1 && items[0].type === "text") {
      return html`<span class=${classMap(classes)}>${items[0].text}</span>`;
    }

    throw new Error("Unexpected format for items array for verse numbers");
  }

  get #trustedContent() {
    if (!Array.isArray(this.content)) {
      throw new TypeError("expected content to be an array");
    }

    for (const itemTag of this.content) {
      if (!itemTag.type) {
        throw new TypeError("expected item tag to have a type");
      }
      if (!itemTag.name) {
        throw new TypeError("expected item tag to have a name");
      }
    }

    return this.content as BibleVerseContent;
  }

  render() {
    return html`
      <span class="scripture-styles">
        ${map(this.#trustedContent, (itemTag) => this.#renderItemTag(itemTag))}
      </span>
    `;
  }
}

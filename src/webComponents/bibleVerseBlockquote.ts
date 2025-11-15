import { findBibleTranslationById } from "../data/bibleTranslationModel";

export class BibleVerseBlockquote extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const templateContent = this.#templateElement.content;

    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  get shouldDisplayCitation() {
    return this.getAttribute("display-citation") === "true" && this.bibleId;
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  #renderCitation() {
    if (!this.bibleId) {
      return;
    }

    const {
      citation: { text, link },
    } = findBibleTranslationById(this.bibleId);

    const paragraphElement = document.createElement("p");
    paragraphElement.className = "citation";
    paragraphElement.innerText = text;

    if (link) {
      paragraphElement.innerHTML += `
        <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
      `;
    }

    this.shadowRoot!.appendChild(paragraphElement);
  }

  get #templateElement() {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = `
      <blockquote>
        <slot name="bible-verse-content">BIBLE VERSE MISSING</slot>
      </blockquote>
    `;

    return templateElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        display: block;
        font-size: 1.25rem;
      }
      blockquote {
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0;
      }
      .citation {
        font-size: 60%;
        margin-top: 3rem;
        margin-bottom: 0;
      }
      a {
        color: var(--color-primary-bright-pink);
      }
      a:hover {
        color: var(--color-primary-bright-pink-darker-one);
      }
      a:visited {
        color: var(--color-primary-bright-pink-darker-two);
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    if (this.shouldDisplayCitation) {
      this.#renderCitation();
    }
  }
}

window.customElements.define("bible-verse-blockquote", BibleVerseBlockquote);

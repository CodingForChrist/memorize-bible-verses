export class BibleVerseBlockquote extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const templateContent = this.#templateElement.content;

    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(templateContent.cloneNode(true));
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
        margin: 1rem 0;
        font-size: 1.25rem;
      }
      blockquote {
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }
}

window.customElements.define("bible-verse-blockquote", BibleVerseBlockquote);

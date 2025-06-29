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
    const colorGray50 = "oklch(98.5% 0.002 247.839)";
    const colorGray300 = "oklch(87.2% 0.01 258.338)";
    const css = `
      :host {
        display: block;
        margin: 1rem 0;
        font-size: 1.25rem;
      }
      blockquote {
        background-color: ${colorGray50};
        border: 0;
        border-left: 4px solid ${colorGray300};
        padding: 1rem;
        margin: 0;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }
}

window.customElements.define("bible-verse-blockquote", BibleVerseBlockquote);

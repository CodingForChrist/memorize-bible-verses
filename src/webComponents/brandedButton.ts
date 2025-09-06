export class BrandedButton extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const templateContent = this.#templateElement.content;

    shadowRoot.appendChild(this.#styleElement);
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  get #buttonType() {
    const type = this.getAttribute("type") as
      | "button"
      | "submit"
      | "reset"
      | null;
    return type ?? "button";
  }

  get #buttonBrand() {
    return this.getAttribute("brand") ?? "primary";
  }

  get #templateElement() {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = `
      <button type="${this.#buttonType}" class="${this.#buttonBrand}">
        <slot name="button-text">BUTTON TEXT MISSING</slot>
      </button>
    `;

    return templateElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
        --primary-color: var(--color-primary-mint-cream);
        --primary-background-color: var(--color-primary-bright-pink);
        --primary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);
        --secondary-color: var(--color-primary-bright-pink);
        --secondary-background-color: var(--color-primary-mint-cream);
        --secondary-border-color: var(--color-primary-bright-pink);
        --secondary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);
        display: inline-block;
      }
      button {
        font: inherit;
        font-size: .875rem;
        line-height: 1.5rem;
        padding: .25rem 1rem;
        cursor: pointer;
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: 1.5rem;
      }
      .primary {
        background-color: var(--primary-background-color);
        color: var(--primary-color);
      }
      .primary:hover {
        filter: brightness(85%);
      }
      .primary:focus-visible {
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(var(--primary-box-shadow-color-rgb), 0.5);
      }
      .secondary {
        background-color: var(--secondary-background-color);
        border: 2px solid var(--secondary-border-color);
        color: var(--secondary-color);
      }
      .secondary:hover {
        filter: brightness(85%);
      }
      .secondary:focus-visible {
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(var(--secondary-box-shadow-color-rgb), 0.5);
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.onclick = () => {
      if (this.#buttonType === "submit") {
        this.closest("form")?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      }
    };
  }
}

window.customElements.define("branded-button", BrandedButton);

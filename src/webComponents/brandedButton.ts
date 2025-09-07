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
        --primary-border-color: var(--color-primary-bright-pink);
        --primary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);

        --primary-color-hover: var(--color-primary-mint-cream);
        --primary-background-color-hover: var(--color-primary-bright-pink-darker-one);
        --primary-border-color-hover: var(--color-primary-bright-pink-darker-two);

        --secondary-color: var(--color-primary-bright-pink);
        --secondary-background-color: var(--color-primary-mint-cream);
        --secondary-border-color: var(--color-primary-bright-pink);
        --secondary-box-shadow-color-rgb: var(--color-primary-mint-cream-rgb);

        --secondary-color-hover: var(--color-primary-bright-pink-darker-two);
        --secondary-background-color-hover: var(--color-primary-mint-cream-darker-one);
        --secondary-border-color-hover: var(--color-primary-bright-pink-darker-two);
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
        border-radius: 1.5rem;
      }
      .primary {
        background-color: var(--primary-background-color);
        border: 1px solid var(--primary-background-color);
        color: var(--primary-color);
      }
      .primary:hover,
      .primary:active {
        color: var(--primary-color-hover);
        background-color: var(--primary-background-color-hover);
        border-color: var(--primary-border-color-hover);
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
      .secondary:hover,
      .secondary:active {
        color: var(--secondary-color-hover);
        background-color: var(--secondary-background-color-hover);
        border-color: var(--secondary-border-color-hover);
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

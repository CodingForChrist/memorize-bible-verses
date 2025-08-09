export class BrandedButton extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#buttonElement);
    shadowRoot.appendChild(this.#styleElement);
  }

  get #buttonElement() {
    const buttonElement = document.createElement("button");
    this.#updateButtonProperties(buttonElement);
    return buttonElement;
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

  get #buttonTextContent() {
    return this.getAttribute("text-content") ?? "";
  }

  #updateButtonProperties(buttonElement: HTMLButtonElement) {
    buttonElement.type = this.#buttonType;
    buttonElement.textContent = this.#buttonTextContent;
    buttonElement.classList.add(this.#buttonBrand);

    console.log(buttonElement);
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
      :host {
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
        background-color: var(--color-primary-bright-pink);
        color: var(--color-primary-mint-cream);
      }
      .primary:hover {
        filter: brightness(85%);
      }
      .secondary {
        background-color: var(--color-primary-mint-cream);
        border: 2px solid var(--color-primary-bright-pink);
        color: var(--color-primary-bright-pink);
      }
      .secondary:hover {
        filter: brightness(85%);
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  connectedCallback() {
    this.onclick = () => {
      if (this.#buttonType === "submit") {
        this.closest("form")?.dispatchEvent(new Event("submit"));
      }
    };
  }
}

window.customElements.define("branded-button", BrandedButton);

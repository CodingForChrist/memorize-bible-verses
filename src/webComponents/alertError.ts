export class AlertError extends HTMLElement {
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
      <div role="alert" class="alert-error-container">
        <slot name="alert-error-message">ERROR MESSAGE MISSING</slot>
      </div>
    `;

    return templateElement;
  }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const colorRed100 = "oklch(93.6% 0.032 17.717)";
    const colorRed300 = "oklch(80.8% 0.114 19.571)";
    const colorRed800 = "oklch(44.4% 0.177 26.899)";
    const css = `
      :host {
        display: block;
      }
      .alert-error-container {
        background-color: ${colorRed100};
        border: 1px solid ${colorRed300};
        border-radius: 1.5rem;
        color: ${colorRed800};
        padding: 1rem;
      }
    `;
    styleElement.textContent = css;
    return styleElement;
  }
}

window.customElements.define("alert-error", AlertError);

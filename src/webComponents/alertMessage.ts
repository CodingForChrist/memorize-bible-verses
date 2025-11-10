import { LitElement, css, html } from "lit";
import { property } from "lit/decorators/property.js";
import { customElement } from "lit/decorators/custom-element.js";

type AlertType = "success" | "info" | "warning" | "danger";

@customElement("alert-message")
export class AlertMessage extends LitElement {
  @property({ reflect: true })
  type: AlertType = "info";

  static styles = css`
    :host {
      --success-color: #084a22;
      --success-background-color: #d0f1dd;
      --success-border-color: #a1e3bb;

      --info-color: #003e58;
      --info-background-color: #ccebf8;
      --info-border-color: #99d7f1;

      --warning-color: #60410c;
      --warning-background-color: #fcedd2;
      --warning-border-color: #f9daa5;

      --danger-color: #651717;
      --danger-background-color: #fed7d7;
      --danger-border-color: #feb0b0;

      display: block;
    }
    .alert-container {
      display: flex;
      align-items: center;
      text-align: left;
      border-radius: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--info-border-color);
    }
    .alert-container svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
    .alert-success {
      color: var(--success-color);
      background-color: var(--success-background-color);
      border-color: var(--success-border-color);
    }
    .alert-info {
      color: var(--info-color);
      background-color: var(--info-background-color);
      border-color: var(--info-border-color);
    }
    .alert-warning {
      color: var(--warning-color);
      background-color: var(--warning-background-color);
      border-color: var(--warning-border-color);
    }
    .alert-danger {
      color: var(--danger-color);
      background-color: var(--danger-background-color);
      border-color: var(--danger-border-color);
    }
  `;

  get #icon() {
    // source: https://heroicons.com/

    switch (this.type) {
      case "success":
        // check-circle
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        `;
      case "info":
        // information-circle
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        `;
      case "warning":
      case "danger":
        // exclamation-circle
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        `;

      default:
        throw new Error("Invalid alert type");
    }
  }

  render() {
    return html`
      <div role="alert" class="alert-container alert-${this.type}">
        ${this.#icon}
        <slot>ALERT MESSAGE MISSING</slot>
      </div>
    `;
  }
}

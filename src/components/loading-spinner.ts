import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("loading-spinner")
export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 2rem 0;
    }
    .loading-spinner-container {
      display: flex;
      justify-content: center;
    }
    .loading-spinner {
      height: 26px;
      width: 26px;
      border: 3px solid var(--color-gray);
      border-top-color: transparent;
      border-radius: calc(infinity * 1px);
      animation: spin 1s linear infinite;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`
      <div class="loading-spinner-container">
        <div class="loading-spinner" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `;
  }
}

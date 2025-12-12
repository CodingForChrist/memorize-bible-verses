import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { query } from "lit/decorators/query.js";

import { breakpointsREM, buttonStyles } from "./shared-styles";

@customElement("modal-dialog")
export class ModalDialog extends LitElement {
  @property({
    type: Boolean,
    reflect: true,
  })
  open: boolean = false;

  @query("dialog")
  dialogElement?: HTMLDialogElement;

  static styles = [
    buttonStyles,
    css`
    dialog {
      background: none;
      border: none;
      display: none;
      opacity: 0;
      padding: 0;
      transition:
        opacity 0.3s,
        display 0.3s allow-discrete,
        overlay 0.3s allow-discrete;
    }
    dialog[open] {
      display: block;
      opacity: 1;
    }
    dialog::backdrop {
      background-color: transparent;
      border 2px inset var(--color-light-gray);
      transition:
        background-color 0.3s,
        display 0.3s allow-discrete,
        overlay 0.3s allow-discrete;
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.7);
    }
    button.svg-icon-container {
      color: var(--color-primary-mint-cream);
      opacity: 0.7;
      cursor: pointer;
      position: fixed;
      top: 0;
      right: 0;
      padding: 0.5rem;
    }
    button.svg-icon-container:hover {
      opacity: 1;
    }
    .dialog-content {
      background-color: var(--color-primary-mint-cream);
      border-radius: 1.5rem;
      color: var(--color-gray);
      text-align: left;
      min-height: 16rem;
      margin: 2rem 0;
      padding: 1.5rem;
      min-width: 12rem;
      max-width: 42rem;

      @media (width >= ${breakpointsREM.small}rem) {
        padding: 1.5rem;
        width: 80vw;
      }
    }
  `,
  ];

  get #xMarkIcon() {
    // x-mark from https://heroicons.com/
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
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    `;
  }

  render() {
    return html`
      <dialog @cancel=${this.#handleClose}>
        <button
          class="svg-icon-container"
          @click=${this.#handleClose}
          aria-label="close dialog"
        >
          ${this.#xMarkIcon}
        </button>
        <div class="dialog-content">
          <slot>DIALOG CONTENT MISSING</slot>
        </div>
      </dialog>
    `;
  }

  updated() {
    if (this.open) {
      this.dialogElement?.showModal();
      document.body.classList.add("no-scroll");
    } else {
      this.dialogElement?.close();
      document.body.classList.remove("no-scroll");
    }
  }

  #handleClose() {
    this.open = false;

    const eventDialogClose = new CustomEvent("close", {
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(eventDialogClose);
  }
}

import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";

import { breakpointsREM, buttonStyles } from "./shared-styles";

@customElement("modal-dialog")
export class ModalDialog extends LitElement {
  @property({
    type: Boolean,
    reflect: true,
  })
  open: boolean = false;
  dialogElementReference: Ref<HTMLDialogElement> = createRef();

  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
        --vertical-margin: 2rem;
      }
      dialog {
        background: none;
        border: none;
        display: none;
        opacity: 0;
        padding: 0;
      }
      dialog[open] {
        display: flex;
        align-items: center;
        opacity: 1;
        overflow: hidden;
      }
      dialog::backdrop {
        background-color: transparent;
        border: 2px inset var(--color-light-gray);
      }
      dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.7);
      }
      .modal-container {
        display: flex;
        flex-direction: column;
        min-height: 16rem;
        height: calc(100vh - var(--vertical-margin) * 2);
        /* dynamic viewport height for ios safari */
        height: calc(100dvh - var(--vertical-margin) * 2);
        width: 90vw;
        max-width: 42rem;
        overflow: hidden;
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);

        @media (min-width: ${breakpointsREM.small}rem) {
          width: 80vw;
        }
      }
      .modal-header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        border-bottom: 1px solid var(--color-light-gray);
        padding: 1rem;
      }
      .modal-header h1 {
        font-size: 1.25rem;
        font-weight: 400;
        margin: 0;
      }
      .modal-header button.svg-icon-container {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--color-dark-gray);
        opacity: 0.6;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
      }
      .modal-header button.svg-icon-container:hover {
        opacity: 1;
      }
      .modal-body {
        padding: 1rem;
        height: 100%;
        overflow-y: auto;
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
      <dialog
        @click=${this.#handleBackdropClick}
        @cancel=${this.#handleClose}
        ${ref(this.dialogElementReference)}
      >
        <div class="modal-container">
          <div class="modal-header">
            <h1>
              <slot name="heading">MODAL DIALOG HEADING CONTENT MISSING</slot>
            </h1>
            <button
              type="button"
              class="svg-icon-container"
              @click=${this.#handleClose}
              aria-label="close dialog"
            >
              ${this.#xMarkIcon}
            </button>
          </div>
          <div class="modal-body">
            <slot name="body">MODAL DIALOG BODY CONTENT MISSING</slot>
          </div>
        </div>
      </dialog>
    `;
  }

  updated() {
    if (this.open) {
      this.dialogElementReference.value?.showModal();
      document.body.classList.add("no-scroll");
    } else {
      this.dialogElementReference.value?.close();
      document.body.classList.remove("no-scroll");
    }
  }

  #handleBackdropClick(event: Event) {
    if (event.target === this.dialogElementReference.value) {
      this.#handleClose();
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

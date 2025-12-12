import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";

import { hyperlinkStyles } from "./shared-styles";

@customElement("app-footer")
export class AppFooter extends LitElement {
  @state()
  isDialogOpen: boolean = false;

  static styles = [
    hyperlinkStyles,
    css`
      :host {
        display: block;
      }
      .button-more-information {
        all: initial;
        font: inherit;
        color: var(--color-primary-mint-cream-darker-two);
        cursor: pointer;
      }
      .button-more-information:hover {
        color: var(--color-primary-mint-cream);
      }
      .button-more-information:focus {
        outline: none;
      }
      .button-more-information:focus svg {
        color: var(--color-primary-bright-pink-darker-one);
        fill: var(--color-primary-mint-cream);
        box-shadow: 0 0 0 0.2rem rgba(var(--color-primary-mint-cream-rgb), 0.5);
      }
      .button-more-information svg {
        width: 2rem;
        height: 2rem;
      }
      footer {
        margin-top: 8rem;
        text-align: center;
      }
      p {
        margin: 0 0 1rem 0;
      }
    `,
  ];

  version = import.meta.env.PACKAGE_VERSION;

  get #infomationCircleIcon() {
    // information-circle from https://heroicons.com/
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
  }

  render() {
    return html`
      <modal-dialog
        ?open=${this.isDialogOpen}
        @close=${() => {
          this.isDialogOpen = false;
        }}
      >
        <p>Memorize Bible Verses version ${this.version}</p>
        <p>
          This bible memorization app is free and open source.
          <a
            href="https://github.com/CodingForChrist/memorize-bible-verses"
            target="_blank"
            rel="noopener noreferrer"
            >Check out the source code on GitHub</a
          >.
        </p>
      </modal-dialog>
      <footer>
        <button
          type="button"
          aria-label="more information"
          class="button-more-information"
          @click=${this.#handleButtonClickToShowDialog}
        >
          ${this.#infomationCircleIcon}
        </button>
      </footer>
    `;
  }

  #handleButtonClickToShowDialog() {
    this.isDialogOpen = true;
  }
}

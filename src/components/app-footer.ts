import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";

import logoURL from "../images/logo.svg";
import { hyperlinkStyles, buttonStyles } from "./shared-styles";

@customElement("app-footer")
export class AppFooter extends LitElement {
  @state()
  isDialogOpen: boolean = false;

  static styles = [
    hyperlinkStyles,
    buttonStyles,
    css`
      :host {
        display: block;
      }
      footer {
        margin-top: 8rem;
      }
      button.svg-icon-container {
        color: var(--color-primary-mint-cream);
        padding: 0.5rem;
        margin: 0 auto;
      }
      button.svg-icon-container:hover {
        color: var(--color-primary-bright-pink);
      }
      button.svg-icon-container:hover svg {
        fill: var(--color-primary-mint-cream);
      }
      .dialog-content {
        text-align: center;
      }
      .dialog-content img {
        width: 10rem;
        margin-bottom: 2rem;
      }
      .dialog-content p {
        margin: 0 0 2rem 0;
        text-wrap: balance;
      }
      figure {
        margin: 0 0 1rem;
      }
      .blockquote {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }
      .blockquote p {
        margin: 0;
      }
      .blockquote-footer::before {
        content: "— ";
      }
      .blockquote-footer {
        margin-bottom: 2rem;
        font-size: 0.875em;
        color: #6c757d;
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
        <div class="dialog-content">
          <img src=${logoURL} alt="Memorize Bible Verses" />

          <figure>
            <blockquote class="blockquote">
              <p>
                Your word I have hidden in my heart, that I might not sin
                against You.
              </p>
            </blockquote>
            <figcaption class="blockquote-footer">Psalm 119:11 NKJV</figcaption>
          </figure>

          <p>
            This bible memorization app is a free tool for you to use to
            practice memorizing scripture so you can grow in your faith.
          </p>
          <p>
            <a
              href="https://github.com/CodingForChrist/memorize-bible-verses"
              target="_blank"
              rel="noopener noreferrer"
              >View the source code on GitHub</a
            >
          </p>
          <p>app version ${this.version}</p>
        </div>
      </modal-dialog>
      <footer>
        <button
          type="button"
          aria-label="more information"
          class="svg-icon-container"
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

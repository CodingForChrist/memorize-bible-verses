import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("collapsible-content")
export class CollapsibleContent extends LitElement {
  @property({ reflect: true, type: Boolean })
  expanded: boolean = false;

  @property({ reflect: true })
  title = "Default title";

  @property({ reflect: true })
  id = crypto.randomUUID();

  static styles = css`
    :host {
      --active-color: var(--color-dark-gray);
      --active-background-color: var(--color-primary-mint-cream-darker-one);
      --border-color: var(--color-light-gray);
      --border-top-right-radius: 1.5rem;
      --border-top-left-radius: 1.5rem;
      --border-bottom-right-radius: 1.5rem;
      --border-bottom-left-radius: 1.5rem;

      display: block;
      border: 1px solid var(--border-color);
      border-top-right-radius: var(--border-top-right-radius);
      border-top-left-radius: var(--border-top-left-radius);
      border-bottom-right-radius: var(--border-bottom-right-radius);
      border-bottom-left-radius: var(--border-bottom-left-radius);
    }
    .heading {
      font: inherit;
      color: var(--color-gray);
      margin: 0;
    }
    .heading button {
      font-size: 1rem;
      line-height: 1.5;
      color: inherit;
      border: none;
      background-color: transparent;
      cursor: pointer;
      width: 100%;
      text-align: left;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top-right-radius: var(--border-top-right-radius);
      border-top-left-radius: var(--border-top-left-radius);
      border-bottom-right-radius: var(--border-bottom-right-radius);
      border-bottom-left-radius: var(--border-bottom-left-radius);
    }
    .heading button[aria-expanded="true"] {
      color: var(--active-color);
      background-color: var(--active-background-color);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom: 1px solid var(--border-color);
    }
    .heading button:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 0.25rem var(--color-focus-ring);
      position: relative;
    }
    .heading svg {
      width: 1.25rem;
      height: 1.25rem;
    }
    .content {
      padding: 1rem 1.25rem;
    }
    .content[aria-hidden="true"] {
      display: none;
    }
  `;

  get #chevronUpIcon() {
    // chevron-up from https://heroicons.com/
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
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    `;
  }

  get #chevronDownIcon() {
    // chevron-down from https://heroicons.com/
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
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    `;
  }

  render() {
    return html`
      <h2 class="heading">
        <button
          type="button"
          aria-expanded="${this.expanded}"
          aria-controls="content-${this.id}"
          @click="${this.#toggle}"
        >
          ${this.title}
          ${this.expanded ? this.#chevronUpIcon : this.#chevronDownIcon}
        </button>
      </h2>
      <div
        id="content-${this.id}"
        class="content"
        aria-hidden="${!this.expanded}"
      >
        <slot></slot>
      </div>
    `;
  }

  #toggle() {
    this.expanded = !this.expanded;
  }
}

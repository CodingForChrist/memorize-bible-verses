import { CUSTOM_EVENTS } from "../../constants";

import type { CustomEventNavigateToPage, PageNavigation } from "../../types";

export class BasePage extends HTMLElement {
  static get observedAttributes() {
    return ["is-visible", "previous-page"];
  }

  // override this title to be page-specific
  get pageTitle() {
    return "︎Memorize Bible Verses";
  }

  get isVisible() {
    return this.getAttribute("is-visible") === "true";
  }

  navigateToPage(pageNavigation: PageNavigation) {
    const eventNavigateToSearchPage =
      new CustomEvent<CustomEventNavigateToPage>(
        CUSTOM_EVENTS.NAVIGATE_TO_PAGE,
        {
          detail: { pageNavigation },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventNavigateToSearchPage);
  }

  #updateVisibility() {
    if (this.isVisible) {
      this.style.display = "block";
      document.title = this.pageTitle;
    } else {
      this.style.display = "none";
    }
  }

  connectedCallback() {
    this.#updateVisibility();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "is-visible" && oldValue !== newValue) {
      this.#updateVisibility();
    }
  }
}

window.customElements.define("base-page", BasePage);

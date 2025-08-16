export class BasePage extends HTMLElement {
  static get observedAttributes() {
    return ["is-visible"];
  }

  // override this title to be page-specific
  get pageTitle() {
    return "︎Memorize Bible Verses";
  }

  get isVisible() {
    return this.getAttribute("is-visible") === "true";
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

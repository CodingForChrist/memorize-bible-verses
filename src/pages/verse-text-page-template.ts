import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";
import { query } from "lit/decorators/query.js";
import { classMap } from "lit/directives/class-map.js";

import { breakpointsREM, buttonStyles } from "../components/shared-styles";

@customElement("verse-text-page-template")
export class VerseTextPageTemplate extends LitElement {
  @state()
  isPageNavigationSticky: boolean = false;

  @query("#page-navigation-sentinel")
  pageNavigationSentinelElement?: HTMLDivElement;

  observer: IntersectionObserver | undefined;

  static styles = [
    buttonStyles,
    css`
      :host {
        margin: 1rem auto;
        text-align: center;
        display: block;
      }
      h1 {
        font-family: var(--font-heading);
        font-size: 2rem;
        font-weight: 400;
        margin: 2rem 0;

        @media (width >= ${breakpointsREM.large}rem) {
          font-size: 2.5rem;
        }
      }
      .page-description {
        margin: 0 1.5rem 1rem;
        text-wrap: balance;

        @media (width >= ${breakpointsREM.small}rem) {
          margin: 0 2.5rem 1rem;
        }
      }
      .search-container {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        text-align: left;
        min-height: 16rem;
        margin: 2rem 0;
        padding: 1.5rem 1rem;

        @media (width >= ${breakpointsREM.small}rem) {
          margin: 2rem 1rem;
          padding: 1.5rem;
        }
      }
      .page-navigation {
        margin: 2rem 0;
        display: flex;
        justify-content: space-between;
        height: 2.5rem;
        position: sticky;
        bottom: 0;

        @media (width >= ${breakpointsREM.small}rem) {
          margin: 2rem 1rem;
        }
      }

      .page-navigation.sticky {
        background-color: var(--color-primary-mint-cream);
        border-top: 3px solid var(--color-light-gray);
        box-shadow: 0 -5px 10px var(--color-light-gray);
        padding: 0.5rem;
        margin: inherit 0;
      }

      .page-navigation button {
        min-width: 6rem;
      }
    `,
  ];

  render() {
    const pageNavigationClasses = {
      sticky: this.isPageNavigationSticky,
      "page-navigation": true,
    };

    return html`
      <h1><slot name="page-heading">PAGE HEADING MISSING</slot></h1>

      <div class="page-description">
        <slot name="page-description">PAGE DESCRIPTION MISSING</slot>
      </div>

      <div class="search-container">
        <slot name="page-content">PAGE CONTENT MISSING</slot>
      </div>

      <!-- used to track when page-navigation element becomes sticky -->
      <div id="page-navigation-sentinel"></div>

      <div class="page-navigation" class=${classMap(pageNavigationClasses)}>
        <button
          id="button-back"
          type="button"
          class="secondary"
          @click=${() =>
            this.dispatchEvent(new Event("page-navigation-back-button-click"))}
        >
          <slot name="page-navigation-back-button">
            PAGE NAVIGATION BACK BUTTON MISSING
          </slot>
        </button>
        <button
          id="button-forward"
          type="button"
          class="primary"
          @click=${() =>
            this.dispatchEvent(
              new Event("page-navigation-forward-button-click"),
            )}
        >
          <slot name="page-navigation-forward-button">
            PAGE NAVIGATION FORWARD BUTTON MISSING
          </slot>
        </button>
      </div>
    `;
  }

  firstUpdated() {
    this.#setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disconnectIntersectionObserver();
  }

  #setupIntersectionObserver() {
    if (!this.pageNavigationSentinelElement) {
      return;
    }

    this.observer = new IntersectionObserver(
      this.#handleIntersection.bind(this),
    );
    this.observer.observe(this.pageNavigationSentinelElement);
  }

  #disconnectIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  #handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const { isIntersecting } of entries) {
      this.isPageNavigationSticky = !isIntersecting;
    }
  }
}

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
        display: block;
      }
      h1 {
        font-family: var(--font-heading);
        font-size: 2rem;
        font-weight: 400;
        margin: 2rem 0 1rem;
        text-align: center;

        @media (width >= ${breakpointsREM.large}rem) {
          font-size: 2.5rem;
          margin: 2rem 0;
        }
      }
      .page-description {
        margin: 0 1.5rem;
        text-align: center;
        text-wrap: balance;

        @media (width >= ${breakpointsREM.small}rem) {
          margin: 0 2.5rem;
        }
      }
      .page-description ::slotted(p) {
        margin: 0 0 1rem;
        text-wrap: balance;
      }
      .main-content-container {
        margin: 0;
        border-radius: 1.5rem;

        @media (width >= ${breakpointsREM.small}rem) {
          margin-left: 1rem;
          margin-right: 1rem;
        }
      }
      .main-content-container.sticky {
        background-color: var(--color-primary-mint-cream);
      }
      .page-content {
        background-color: var(--color-primary-mint-cream);
        border-radius: 1.5rem;
        color: var(--color-gray);
        text-align: left;
        min-height: 16rem;
        margin: 2rem 0;
        padding: 1.5rem 1rem;

        @media (width >= ${breakpointsREM.small}rem) {
          padding: 1.5rem;
        }
      }
      .page-navigation {
        display: flex;
        justify-content: space-between;
        height: 2.5rem;
        position: sticky;
        bottom: 0;
      }
      .page-navigation button {
        min-width: 6rem;
      }
      .page-navigation.sticky {
        background-color: var(--color-primary-mint-cream);
        border-top: 2px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);
        padding: 0.5rem;
        margin: inherit 0;
      }
      .page-navigation.sticky button {
        --primary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
        --secondary-box-shadow-color-rgb: var(--color-primary-bright-pink-rgb);
      }
    `,
  ];

  render() {
    return html`
      <h1><slot name="page-heading">PAGE HEADING MISSING</slot></h1>

      <div class="page-description">
        <slot name="page-description">PAGE DESCRIPTION MISSING</slot>
      </div>

      <div
        class=${classMap({
          sticky: this.isPageNavigationSticky,
          "main-content-container": true,
        })}
      >
        <div class="page-content">
          <slot name="page-content">PAGE CONTENT MISSING</slot>
        </div>

        <div
          class=${classMap({
            sticky: this.isPageNavigationSticky,
            "page-navigation": true,
          })}
        >
          <button
            id="button-back"
            type="button"
            class="secondary"
            @click=${() =>
              this.dispatchEvent(
                new Event("page-navigation-back-button-click"),
              )}
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

        <!-- used to track when page-navigation element becomes sticky -->
        <div id="page-navigation-sentinel"></div>
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

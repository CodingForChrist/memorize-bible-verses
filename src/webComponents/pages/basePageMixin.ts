import { LitElement } from "lit";
import { property } from "lit/decorators/property.js";

import { CUSTOM_EVENTS } from "../../constants";

import type { PropertyValues } from "lit";
import type { CustomEventNavigateToPage, PageNavigation } from "../../types";

type Constructor<T> = new (...args: any[]) => T;

export declare class BasePageInterface {
  visible: boolean;
  pageTitle: string;
  previousPage?: string;
  navigateToPage(pageNavigation: PageNavigation): void;
}

export const BasePage = <T extends Constructor<LitElement>>(superClass: T) => {
  class BasePageElement extends superClass {
    pageTitle: string = "";

    @property({ type: Boolean, reflect: true })
    visible: boolean = false;

    @property({ attribute: "previous-page", reflect: true })
    previousPage?: string;

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

    #updateDocumentTitle() {
      document.title = `${this.pageTitle} | Memorize Bible Verses`;
    }

    updated(changedProperties: PropertyValues<this>) {
      if (!changedProperties.has("visible")) {
        return;
      }

      if (this.visible) {
        this.style.display = "block";
        this.#updateDocumentTitle();
      } else {
        this.style.display = "none";
      }
    }
  }
  return BasePageElement as Constructor<BasePageInterface> & T;
};

import { LitElement } from "lit";
import { property } from "lit/decorators/property.js";

import { CUSTOM_EVENT, type PageName } from "../constants";
import type { CustomEventNavigateToPage, PageNavigation } from "../types";

type Constructor<T> = new (...args: any[]) => T;

export declare class BasePageInterface {
  pageTitle: string;
  previousPage?: PageName;
  navigateToPage(pageNavigation: PageNavigation): void;
}

export const BasePage = <T extends Constructor<LitElement>>(superClass: T) => {
  class BasePageElement extends superClass {
    pageTitle: string = "";

    @property({ attribute: "previous-page", reflect: true })
    previousPage?: PageName;

    navigateToPage(pageNavigation: PageNavigation) {
      const eventNavigateToSearchPage =
        new CustomEvent<CustomEventNavigateToPage>(
          CUSTOM_EVENT.NAVIGATE_TO_PAGE,
          {
            detail: { pageNavigation },
            bubbles: true,
            composed: true,
          },
        );
      this.dispatchEvent(eventNavigateToSearchPage);
    }

    firstUpdated() {
      document.title = `${this.pageTitle} | Memorize Bible Verses`;
    }
  }
  return BasePageElement as Constructor<BasePageInterface> & T;
};

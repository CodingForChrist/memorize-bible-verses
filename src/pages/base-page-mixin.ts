import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { CUSTOM_EVENT, type PageName } from "../constants";

type PageNavigation = {
  nextPage: PageName;
  previousPage?: PageName;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...arguments_: any[]) => T;

export declare class BasePageInterface {
  pageTitle: string;
  previousPage?: PageName;
  navigateToPage(pageNavigation: PageNavigation): void;
}

export const BasePage = <T extends Constructor<LitElement>>(superClass: T) => {
  class BasePageElement extends superClass {
    @property({ attribute: "previous-page", reflect: true })
    previousPage?: PageName;

    #pageTitle: string = "";

    set pageTitle(value: string) {
      this.#pageTitle = `${value} - Memorize Bible Verses`;
      document.title = this.#pageTitle;
    }

    get pageTitle() {
      return this.#pageTitle;
    }

    navigateToPage(pageNavigation: PageNavigation) {
      const eventNavigateToSearchPage = new CustomEvent<{
        pageNavigation: PageNavigation;
      }>(CUSTOM_EVENT.NAVIGATE_TO_PAGE, {
        detail: { pageNavigation },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(eventNavigateToSearchPage);
    }
  }
  return BasePageElement as Constructor<BasePageInterface> & T;
};

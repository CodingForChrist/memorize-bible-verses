import { CUSTOM_EVENTS, WEB_COMPONENT_PAGES } from "../constants";

import type { CustomEventNavigateToPage, PageNavigation } from "../types";

type AllowedParams = "page" | "translation" | "verse";

class Router {
  constructor() {
    window.history.scrollRestoration = "manual";
    this.removeUnknownParams();
  }

  get allowedParams() {
    return new Set<AllowedParams>(["page", "translation", "verse"]);
  }
  getParam(name: AllowedParams) {
    if (!this.allowedParams.has(name)) {
      throw new Error("Invalid query parameter name");
    }

    return new URL(window.location.href).searchParams.get(name);
  }

  setParams({
    params,
    shouldUpdateBrowserHistory = true,
  }: {
    params: { [key in AllowedParams]?: string };
    shouldUpdateBrowserHistory?: boolean;
  }) {
    const url = new URL(window.location.href);

    for (const [name, value] of Object.entries(params)) {
      if (!this.allowedParams.has(name as AllowedParams)) {
        throw new Error("Invalid query parameter name");
      }
      if (value) {
        url.searchParams.set(name, value);
      }
    }

    if (shouldUpdateBrowserHistory) {
      history.pushState({}, "", url);
    } else {
      history.replaceState({}, "", url);
    }
  }

  removeUnknownParams() {
    const url = new URL(window.location.href);

    const paramsToDelete = [];
    for (const [key] of url.searchParams.entries()) {
      if (!this.allowedParams.has(key as AllowedParams)) {
        paramsToDelete.push(key);
      }
    }

    for (const param of paramsToDelete) {
      url.searchParams.delete(param);
    }
    history.replaceState({}, "", url);
  }

  navigateToPageBasedOnURLParam({ shouldUpdateBrowserHistory = false }) {
    const pageNavigation: PageNavigation = {
      nextPage: this.getParam("page") || WEB_COMPONENT_PAGES.INSTRUCTIONS_PAGE,
      bibleTranslation: this.getParam("translation") || "NKJV",
      shouldUpdateBrowserHistory,
    };

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

  setupPopStateListenerForBrowserHistory() {
    // Update page when user navigates with browser back/forward buttons
    window.addEventListener("popstate", () => {
      this.navigateToPageBasedOnURLParam({ shouldUpdateBrowserHistory: false });
    });
  }
}

export const router = new Router();

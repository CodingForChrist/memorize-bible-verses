import { describe, expect, test, beforeEach, vi } from "vitest";

import { getStateFromURL, setStateInURL } from "./router";

const defaultLocationData = {
  origin: "http://localhost:3000",
  pathname: "/memorize-bible-verses/",
  href: "http://localhost:3000/memorize-bible-verses/",
};

describe("getStateFromURL()", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  test("should return undefined for url with no hash", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "",
    });

    expect(getStateFromURL()).toBeUndefined();
  });

  test("should return undefined for an invalid page name", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "#/invalid-page-name",
    });

    expect(getStateFromURL()).toBeUndefined();
  });

  test("should return valid page name", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "#/instructions",
    });

    expect(getStateFromURL()?.pageName).toBe("instructions");
  });

  test("should return valid page name, translation, and verse", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
    });

    expect(getStateFromURL()).toEqual({
      pageName: "search-verses-for-awana",
      translation: "NASB 1995",
      verse: "Psalm 9:10",
    });
  });
});

describe("setStateInURL()", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  test("should add page name to url with no hash", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "",
    });

    const pushStateSpy = vi.spyOn(window.history, "pushState");
    setStateInURL({
      pageName: "instructions",
      shouldUpdateBrowserHistory: true,
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      {},
      "",
      "http://localhost:3000/memorize-bible-verses/#/instructions",
    );
  });

  test("should call replaceState when shouldUpdateBrowserHistory is false", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      hash: "",
    });

    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    setStateInURL({
      pageName: "instructions",
      shouldUpdateBrowserHistory: false,
    });

    expect(replaceStateSpy).toHaveBeenCalledWith(
      {},
      "",
      "http://localhost:3000/memorize-bible-verses/#/instructions",
    );
  });

  test("should preserve existing parameters", () => {
    vi.stubGlobal("location", {
      ...window.location,
      ...defaultLocationData,
      href: "http://localhost:3000/memorize-bible-verses/#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
      hash: "#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
    });

    const pushStateSpy = vi.spyOn(window.history, "pushState");
    setStateInURL({
      pageName: "search-advanced",
      verse: "John 3:16",
      shouldUpdateBrowserHistory: true,
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      {},
      "",
      "http://localhost:3000/memorize-bible-verses/#/search-advanced?translation=NASB+1995&verse=John+3%3A16",
    );
  });
});

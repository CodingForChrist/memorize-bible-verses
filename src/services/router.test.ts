import { describe, expect, test, beforeEach, vi } from "vitest";

import {
  getStateFromURL,
  setStateInURL,
  deleteUnknownParametersInURL,
} from "./router";

function stubLocationData({ hash }: { hash: string }) {
  const {
    origin,
    pathname,
    href,
    hash: hashValue,
  } = new URL(hash, `http://localhost:3000/memorize-bible-verses/`);
  vi.stubGlobal("location", {
    ...globalThis.location,
    origin,
    pathname,
    href,
    hash: hashValue,
  });
}

describe("getStateFromURL()", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("should return undefined for url with no hash", () => {
    stubLocationData({ hash: "" });

    expect(getStateFromURL()).toBeUndefined();
  });

  test("should return undefined for an invalid page name", () => {
    stubLocationData({ hash: "#/invalid-page-name" });
    expect(getStateFromURL()).toBeUndefined();
  });

  test("should return valid page name", () => {
    stubLocationData({ hash: "#/instructions" });
    expect(getStateFromURL()?.pageName).toBe("instructions");
  });

  test("should return valid page name, translation, and verse", () => {
    stubLocationData({
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
    vi.clearAllMocks();
  });

  test("should add page name to url with no hash", () => {
    stubLocationData({
      hash: "",
    });

    const pushStateSpy = vi.spyOn(globalThis.history, "pushState");
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
    stubLocationData({
      hash: "",
    });

    const replaceStateSpy = vi.spyOn(globalThis.history, "replaceState");
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
    stubLocationData({
      hash: "#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
    });

    const pushStateSpy = vi.spyOn(globalThis.history, "pushState");
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

describe("deleteUnknownParametersInURL()", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("should not update url when there is no hash", () => {
    stubLocationData({
      hash: "",
    });

    const replaceStateSpy = vi.spyOn(globalThis.history, "replaceState");
    deleteUnknownParametersInURL();

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  test("should not update url when all params are valid", () => {
    stubLocationData({
      hash: "#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
    });

    const replaceStateSpy = vi.spyOn(globalThis.history, "replaceState");
    deleteUnknownParametersInURL();

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  test("should remove unknown parameters", () => {
    stubLocationData({
      hash: "#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10&unknown-parameter=1&tracking=12345",
    });

    const replaceStateSpy = vi.spyOn(globalThis.history, "replaceState");
    deleteUnknownParametersInURL();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      {},
      "",
      "http://localhost:3000/memorize-bible-verses/#/search-verses-for-awana?translation=NASB+1995&verse=Psalm+9%3A10",
    );
  });
});

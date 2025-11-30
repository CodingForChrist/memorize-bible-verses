import { PAGE_NAME, type PageName } from "../constants";

export function getStateFromURL() {
  if (!window.location.hash) {
    return;
  }

  const pathNameWithQueryString = window.location.hash.replace("#", "");
  const url = new URL(pathNameWithQueryString, window.location.origin);
  const pathName = url.pathname.replace("/", "");

  if (!Object.values(PAGE_NAME).includes(pathName as PageName)) {
    return;
  }

  return {
    pageName: pathName as PageName,
    verse: url.searchParams.get("verse") ?? undefined,
    translation: url.searchParams.get("translation") ?? undefined,
  };
}

export function setStateInURL({
  pageName,
  verse,
  translation,
  shouldUpdateBrowserHistory,
}: {
  pageName: PageName;
  verse?: string;
  translation?: string;
  shouldUpdateBrowserHistory?: boolean;
}) {
  const url = getURLWithoutHash();
  url.pathname = `/memorize-bible-verses/${pageName}`;
  url.hash = "";

  if (translation) {
    url.searchParams.set("translation", translation);
  }
  if (verse) {
    url.searchParams.set("verse", verse);
  }

  if (shouldUpdateBrowserHistory) {
    history.pushState({}, "", convertToHashURL(url));
  } else {
    history.replaceState({}, "", convertToHashURL(url));
  }
}

export function deleteUnknownParametersInURL() {
  const allowedParams = ["translation", "verse"];
  const url = getURLWithoutHash();

  const paramsToDelete = [];
  for (const [key] of url.searchParams.entries()) {
    if (!allowedParams.includes(key)) {
      paramsToDelete.push(key);
    }
  }

  // exit early when all params are valid
  if (paramsToDelete.length === 0) {
    return;
  }

  for (const param of paramsToDelete) {
    url.searchParams.delete(param);
  }

  history.replaceState({}, "", convertToHashURL(url));
}

function getURLWithoutHash() {
  const urlWithoutHash = window.location.href.replace(
    "/memorize-bible-verses/#/",
    "/memorize-bible-verses/",
  );

  return new URL(urlWithoutHash);
}

function convertToHashURL(url: URL) {
  return url
    .toString()
    .replace("/memorize-bible-verses/", "/memorize-bible-verses/#/");
}

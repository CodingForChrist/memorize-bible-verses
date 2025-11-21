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
  const urlWithoutHash = window.location.href
    .toString()
    .replace("/memorize-bible-verses/#/", "/memorize-bible-verses/");

  const url = new URL(urlWithoutHash);
  url.pathname = `/memorize-bible-verses/${pageName}`;
  url.hash = "";

  if (translation) {
    url.searchParams.set("translation", translation);
  }
  if (verse) {
    url.searchParams.set("verse", verse);
  }

  const urlStringWithHash = url
    .toString()
    .replace("/memorize-bible-verses/", "/memorize-bible-verses/#/");

  if (shouldUpdateBrowserHistory) {
    history.pushState({}, "", urlStringWithHash);
  } else {
    history.replaceState({}, "", urlStringWithHash);
  }
}

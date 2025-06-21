export function removeExtraContentFromBibleVerse(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  removeSectionTitles(divElement);
  removeFootnotes(divElement);
  removeVerseNumbers(divElement);
  trimParagraphBreaks(divElement);

  return divElement.innerHTML;
}

function removeFootnotes(element: Element) {
  element
    .querySelectorAll("p.r")
    ?.forEach((footnoteElement) => footnoteElement.remove());

  return element;
}

function removeSectionTitles(element: Element) {
  element
    .querySelectorAll("p.s1")
    ?.forEach((titleElement) => titleElement.remove());

  return element;
}

function removeVerseNumbers(element: Element) {
  element
    .querySelectorAll("[data-number]")
    ?.forEach((verseNumberElement) => verseNumberElement.remove());

  return element;
}

function trimParagraphBreaks(element: Element) {
  const firstChildElement = element.firstElementChild;
  const lastChildElement = element.lastElementChild;

  if (firstChildElement && firstChildElement.classList.contains("b")) {
    firstChildElement.remove();
  }

  if (lastChildElement && lastChildElement.classList.contains("b")) {
    lastChildElement.remove();
  }

  return element;
}

export function convertBibleVerseToText(htmlContentString: string) {
  const strippedHTMLContent =
    removeExtraContentFromBibleVerse(htmlContentString);

  const divElement = document.createElement("div");
  divElement.innerHTML = strippedHTMLContent;

  return divElement.innerText.trim();
}

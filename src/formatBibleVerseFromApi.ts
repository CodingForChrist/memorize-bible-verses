export function removeExtraContentFromBibleVerse(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  removeSectionHeadings(divElement);
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

function removeSectionHeadings(element: Element) {
  const cssClasses = [
    "ms",
    "ms1",
    "ms2",
    "ms3",
    "s",
    "s1",
    "s2",
    "s3",
    "s4",
    "d",
  ];

  for (const cssClass of cssClasses) {
    element
      .querySelectorAll(`p.${cssClass}`)
      ?.forEach((titleElement) => titleElement.remove());
  }

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

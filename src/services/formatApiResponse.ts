type RemoveExtraContentFromBibleVerseOptions = {
  shouldRemoveSectionHeadings: boolean;
  shouldRemoveFootnotes: boolean;
  shouldRemoveVerseNumbers: boolean;
  shouldTrimParagraphBreaks: boolean;
};

const defaultOptions = {
  shouldRemoveSectionHeadings: true,
  shouldRemoveFootnotes: true,
  shouldRemoveVerseNumbers: true,
  shouldTrimParagraphBreaks: true,
};

export function removeExtraContentFromBibleVerse(
  htmlContentString: string,
  {
    shouldRemoveSectionHeadings,
    shouldRemoveFootnotes,
    shouldRemoveVerseNumbers,
    shouldTrimParagraphBreaks,
  }: RemoveExtraContentFromBibleVerseOptions = defaultOptions,
) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  if (shouldRemoveSectionHeadings) {
    removeSectionHeadings(divElement);
  }
  if (shouldRemoveFootnotes) {
    removeFootnotes(divElement);
  }
  if (shouldRemoveVerseNumbers) {
    removeVerseNumbers(divElement);
  }
  if (shouldTrimParagraphBreaks) {
    trimParagraphBreaks(divElement);
  }

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
    "cl",
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

  const textArray = Array.from(divElement.children).map((childElement) => {
    if (childElement.nodeName === "P") {
      return (childElement as HTMLParagraphElement).innerText.trim();
    }
    throw new Error(
      `Unexpected element in verse html "${childElement.nodeName}"`,
    );
  });

  return textArray.join(" ");
}

export function standardizeBookNameInVerseReference(verseReference: string) {
  // the singular version "Psalm" is used for displaying references (ex: Psalm 23)
  // but the data structure for a verse reference always uses "Psalms"
  // this code handles that difference to make sure they match
  if (verseReference.startsWith("Psalms")) {
    const psalmVerseReference = verseReference.replace("Psalms", "Psalm");
    return psalmVerseReference;
  }

  return verseReference;
}

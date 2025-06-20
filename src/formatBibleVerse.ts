export function removeTitlesAndNotesFromBibleVerse(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  // remove section titles from content
  divElement.querySelectorAll("p.s1")?.forEach((element) => element.remove());

  // remove footnotes from content
  divElement.querySelectorAll("p.r")?.forEach((element) => element.remove());

  return divElement.innerHTML;
}

export function removeVerseNumbersFromBibleVerse(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  // remove verse numbers
  divElement
    .querySelectorAll("[data-number]")
    ?.forEach((element) => element.remove());

  return divElement.innerHTML;
}

export function convertBibleVerseToText(htmlContent: string) {
  const htmlContentWithoutTitlesAndNotes =
    removeTitlesAndNotesFromBibleVerse(htmlContent);
  const basicHTMLContent = removeVerseNumbersFromBibleVerse(
    htmlContentWithoutTitlesAndNotes,
  );

  const divElement = document.createElement("div");
  divElement.innerHTML = basicHTMLContent;

  return divElement.innerText.trim();
}

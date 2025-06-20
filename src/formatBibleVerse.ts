export function removeTitlesAndNotesFromBibleVerse(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  // remove section titles from content
  divElement.querySelectorAll("p.s1")?.forEach((element) => element.remove());

  // remove footnotes from content
  divElement.querySelectorAll("p.r")?.forEach((element) => element.remove());

  return divElement.innerHTML;
}

export function convertBibleVerseToText(htmlContent: string) {}

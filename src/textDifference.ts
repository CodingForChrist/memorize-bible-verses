import { diffWords } from "diff";

export function getDifferenceBetweenVerseAndInput(
  input: string,
  verse: string,
) {
  const difference = diffWords(input, verse, {
    ignoreCase: true,
  });

  console.log(difference);

  const fragment = document.createDocumentFragment();
  let errorCount = 0;
  for (const part of difference) {
    // green for additions, red for deletions
    // grey for common parts
    let color = "grey";

    if (part.added) {
      // ignore punctuation
      if (![".", ";", ","].includes(part.value.trim())) {
        color = "green";
        errorCount++;
      }
    }

    if (part.removed) {
      color = "red";
      errorCount++;
    }

    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  }

  console.log({
    errorCount,
  });

  return fragment;
}

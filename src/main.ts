import {
  getAllBibles,
  getBibleVerses,
  getVerseText,
  type BibleAbbreviationLocal,
} from "./bibleVerses";

import {
  createSpeechRecognitionInstance,
  formatTranscriptToString,
} from "./webSpeechApi";
import { getDifferenceBetweenVerseAndInput } from "./textDifference";

function getRequiredElements() {
  const selectBibleTranslation = document.querySelector<HTMLSelectElement>(
    "#select-bible-translation",
  );

  const selectVerseList =
    document.querySelector<HTMLSelectElement>("#select-verse-list");

  const buttonStart =
    document.querySelector<HTMLButtonElement>("#button-start");

  const buttonStop = document.querySelector<HTMLButtonElement>("#button-stop");

  const divResults = document.querySelector<HTMLDivElement>("#results");

  if (
    !selectBibleTranslation ||
    !selectVerseList ||
    !buttonStart ||
    !buttonStop ||
    !divResults
  ) {
    throw new Error("Missing required DOM Elements");
  }

  return {
    selectBibleTranslation,
    selectVerseList,
    buttonStart,
    buttonStop,
    divResults,
  };
}

type PopulateSelectElementInput = {
  selectElement: Element;
  selectOptions: { id: string; textContent: string }[];
};

function populateSelectElement({
  selectElement,
  selectOptions,
}: PopulateSelectElementInput) {
  selectElement.innerHTML = "";

  for (const { id, textContent } of selectOptions) {
    const optionElement = document.createElement("option");
    optionElement.textContent = textContent;
    optionElement.value = id;
    selectElement.appendChild(optionElement);
  }
}

function setupForm() {
  const { selectBibleTranslation, selectVerseList } = getRequiredElements();

  const bibleSelectOptions = getAllBibles().map(
    ({ nameLocal, abbreviationLocal }) => {
      return {
        id: abbreviationLocal,
        textContent: `${nameLocal} (${abbreviationLocal})`,
      };
    },
  );

  populateSelectElement({
    selectElement: selectBibleTranslation,
    selectOptions: bibleSelectOptions,
  });

  const getVerseSelectOptions = (
    bibleAbbreviationLocal: BibleAbbreviationLocal,
  ) =>
    getBibleVerses(bibleAbbreviationLocal).map(({ reference, verseId }) => ({
      id: verseId,
      textContent: reference,
    }));

  populateSelectElement({
    selectElement: selectVerseList,
    selectOptions: getVerseSelectOptions(
      selectBibleTranslation.value as BibleAbbreviationLocal,
    ),
  });

  selectBibleTranslation.addEventListener("change", (event: Event) => {
    const eventTarget = event.target as HTMLSelectElement;
    populateSelectElement({
      selectElement: selectVerseList,
      selectOptions: getVerseSelectOptions(
        eventTarget.value as BibleAbbreviationLocal,
      ),
    });
  });
}

function onLoad() {
  const { buttonStart, buttonStop, divResults } = getRequiredElements();

  setupForm();
  const speechRecognition = createSpeechRecognitionInstance();

  buttonStart.addEventListener("click", () => {
    divResults.innerHTML = "";
    speechRecognition.start();
  });

  buttonStop.addEventListener("click", () => {
    speechRecognition.stop();
  });

  let lastSpeechRecognitionResult: SpeechRecognitionResultList;
  speechRecognition.addEventListener(
    "result",
    (event: SpeechRecognitionEvent) => {
      lastSpeechRecognitionResult = event.results;
    },
  );

  speechRecognition.addEventListener("end", () => {
    processSpeechRecognitionResult(lastSpeechRecognitionResult);
  });
}

function processSpeechRecognitionResult(
  speechRecognitionResultList: SpeechRecognitionResultList,
) {
  const { divResults, selectBibleTranslation, selectVerseList } =
    getRequiredElements();

  const verseText = getVerseText(
    selectBibleTranslation.value as BibleAbbreviationLocal,
    selectVerseList.value,
  );

  const transcript = formatTranscriptToString(speechRecognitionResultList);
  const fragment = getDifferenceBetweenVerseAndInput(transcript, verseText);

  const divVerseText = document.createElement("div");
  divVerseText.innerHTML = verseText;

  const divTranscript = document.createElement("div");
  divTranscript.innerHTML = transcript;

  divResults.append(divVerseText, divTranscript, fragment);
}

onLoad();

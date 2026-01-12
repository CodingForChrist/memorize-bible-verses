const bibleTranslationLocalStorageKey = "bibleTranslation";

type BibleTranslationForLocalStorage = {
  id: string;
  abbreviation: string;
};

export function getBibleTranslationFromLocalStorage() {
  try {
    const data = globalThis.localStorage.getItem(
      bibleTranslationLocalStorageKey,
    );
    if (!data) {
      return;
    }
    const jsonData = JSON.parse(data);
    if (typeof jsonData === "object" && jsonData.id && jsonData.abbreviation) {
      return jsonData as BibleTranslationForLocalStorage;
    }
  } catch (error) {
    console.error(
      "Failed to read preferred bible translation from local storage",
      error,
    );
  }
}

export function setBibleTranslationInLocalStorage({
  id,
  abbreviation,
}: BibleTranslationForLocalStorage) {
  try {
    globalThis.localStorage.setItem(
      bibleTranslationLocalStorageKey,
      JSON.stringify({ id, abbreviation }),
    );
  } catch (error) {
    console.error(
      "Failed to write preferred bible translation to local storage",
      error,
    );
  }
}

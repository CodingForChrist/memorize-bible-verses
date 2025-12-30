const bibleTranslationLocalStorageKey = "bibleTranslation";

type BibleTranslationForLocalStorage = {
  id: string;
  abbreviationLocal: string;
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
    if (
      typeof jsonData === "object" &&
      jsonData.id &&
      jsonData.abbreviationLocal
    ) {
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
  abbreviationLocal,
}: BibleTranslationForLocalStorage) {
  try {
    globalThis.localStorage.setItem(
      bibleTranslationLocalStorageKey,
      JSON.stringify({ id, abbreviationLocal }),
    );
  } catch (error) {
    console.error(
      "Failed to write preferred bible translation to local storage",
      error,
    );
  }
}

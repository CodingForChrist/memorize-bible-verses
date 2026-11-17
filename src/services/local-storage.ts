const bibleTranslationLocalStorageKey = "bibleTranslation";
const awanaBookLocalStorageKey = "awanaBook";

function getItem(key: string) {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read "${key}" from local storage`, error);
  }
}

function setItem(key: string, value: Record<string, string>) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write "${key}" to local storage`, error);
  }
}

type BibleTranslationForLocalStorage = {
  id: string;
  abbreviation: string;
};

export function getBibleTranslationFromLocalStorage() {
  const data = getItem(bibleTranslationLocalStorageKey);

  if (typeof data === "object" && data.id && data.abbreviation) {
    return data as BibleTranslationForLocalStorage;
  }
}

export function setBibleTranslationInLocalStorage({
  id,
  abbreviation,
}: BibleTranslationForLocalStorage) {
  setItem(bibleTranslationLocalStorageKey, { id, abbreviation });
}

type AwanaBookForLocalStorage = {
  awanaBookId: string;
};

export function getAwanaBookFromLocalStorage() {
  const data = getItem(awanaBookLocalStorageKey);

  if (typeof data === "object" && data.awanaBookId) {
    return data as AwanaBookForLocalStorage;
  }
}

export function setAwanaBookInLocalStorage({
  awanaBookId,
}: AwanaBookForLocalStorage) {
  setItem(awanaBookLocalStorageKey, { awanaBookId });
}

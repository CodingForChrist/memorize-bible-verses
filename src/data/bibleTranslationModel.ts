import bibleTranslations from "./bibleTranslations.json";

export function getAllBibleTranslations() {
  return bibleTranslations;
}

export function findBibleTranslationById(id: string) {
  const bibleTranslation = bibleTranslations.find(
    (bibleTranslation) => bibleTranslation.id === id,
  );
  if (!bibleTranslation) {
    throw new Error("Failed to find the bible translation by id");
  }
  return bibleTranslation;
}

export function findBibleTranslationByAbbreviation(abbreviation: string) {
  const bibleTranslation = bibleTranslations.find(
    (bibleTranslation) => bibleTranslation.abbreviationLocal === abbreviation,
  );
  if (!bibleTranslation) {
    throw new Error("Failed to find the bible translation by abbreviation");
  }
  return bibleTranslation;
}

import { BibleTranslationArraySchema } from "../schemas/bible-translation-schema";
import bibleTranslations from "./bible-translations.json";

export function getAllBibleTranslations() {
  return BibleTranslationArraySchema.parse(bibleTranslations);
}

export function findBibleTranslationById(id: string) {
  const bibleTranslation = getAllBibleTranslations().find(
    (bibleTranslation) => bibleTranslation.id === id,
  );
  if (!bibleTranslation) {
    throw new Error("Failed to find the bible translation by id");
  }
  return bibleTranslation;
}

export function findBibleTranslationByAbbreviation(abbreviation: string) {
  const bibleTranslation = getAllBibleTranslations().find(
    (bibleTranslation) => bibleTranslation.abbreviation === abbreviation,
  );
  if (!bibleTranslation) {
    throw new Error("Failed to find the bible translation by abbreviation");
  }
  return bibleTranslation;
}

export type BibleTranslation = {
  id: string;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  description: string;
};

export type BibleVerse = {
  id: string;
  reference: string;
  content: string;
};

export type CustomEventUpdateBibleTranslation = {
  bibleTranslation: BibleTranslation;
};

export type CustomEventUpdateBibleVerse = {
  bibleVerse: BibleVerse;
};

export type CustomEventUpdateRecitedBibleVerse = {
  recitedBibleVerse: string;
};

export type CustomEventNavigateToStep = {
  stepNumber: number;
};

export type CustomEventSearchForBibleVerse = {
  bibleVerseReference: string;
};

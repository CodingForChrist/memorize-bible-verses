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
  bibleId: string;
  reference: string;
  content: string;
  verseCount: number;
};

export type PageNavigation = {
  nextPage: string;
  previousPage?: string;
  bibleTranslation?: string;
  shouldUpdateBrowserHistory?: boolean;
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

export type CustomEventNavigateToPage = {
  pageNavigation: PageNavigation;
};

export type CustomEventSearchForBibleVerse = {
  verseReference: string;
};

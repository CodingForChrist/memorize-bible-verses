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

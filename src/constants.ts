export const CUSTOM_EVENT = {
  UPDATE_BIBLE_TRANSLATION: "UPDATE_BIBLE_TRANSLATION",
  UPDATE_BIBLE_VERSE: "UPDATE_BIBLE_VERSE",
  UPDATE_RECITED_BIBLE_VERSE: "UPDATE_RECITED_BIBLE_VERSE",
  NAVIGATE_TO_PAGE: "NAVIGATE_TO_PAGE",
} as const;

export type CustomEvent = (typeof CUSTOM_EVENT)[keyof typeof CUSTOM_EVENT];

export const PAGE_NAME = {
  INSTRUCTIONS_PAGE: "instructions",
  SEARCH_OPTIONS_PAGE: "search-options",
  VERSE_OF_THE_DAY_PAGE: "verse-of-the-day",
  SHARE_THE_GOSPEL_PAGE: "share-the-gospel",
  PSALM_23_PAGE: "psalm-23",
  VERSES_FOR_AWANA_PAGE: "verses-for-awana",
  ADVANCED_SEARCH_PAGE: "advanced-search",
  SPEAK_VERSE_FROM_MEMORY_PAGE: "speak-verse-from-memory",
  SCORE_PAGE: "score",
} as const;

export type PageName = (typeof PAGE_NAME)[keyof typeof PAGE_NAME];

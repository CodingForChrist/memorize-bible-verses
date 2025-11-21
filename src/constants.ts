export const CUSTOM_EVENT = {
  UPDATE_BIBLE_TRANSLATION: "UPDATE_BIBLE_TRANSLATION",
  UPDATE_BIBLE_VERSE: "UPDATE_BIBLE_VERSE",
  UPDATE_RECITED_BIBLE_VERSE: "UPDATE_RECITED_BIBLE_VERSE",
  NAVIGATE_TO_PAGE: "NAVIGATE_TO_PAGE",
} as const;

export type CustomEvent = (typeof CUSTOM_EVENT)[keyof typeof CUSTOM_EVENT];

export const PAGE_NAME = {
  INSTRUCTIONS_PAGE: "instructions-page",
  SEARCH_OPTIONS_PAGE: "search-options-page",
  SEARCH_VERSE_OF_THE_DAY_PAGE: "search-verse-of-the-day-page",
  SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE:
    "search-verses-for-sharing-the-gospel-page",
  SEARCH_PSALM_23_PAGE: "search-psalm-23-page",
  SEARCH_VERSES_FOR_AWANA_PAGE: "search-verses-for-awana-page",
  SEARCH_ADVANCED_PAGE: "search-advanced-page",
  SPEAK_VERSE_FROM_MEMORY_PAGE: "speak-verse-from-memory-page",
  TYPE_VERSE_FROM_MEMORY_PAGE: "type-verse-from-memory-page",
  SCORE_PAGE: "score-page",
} as const;

export type PageName = (typeof PAGE_NAME)[keyof typeof PAGE_NAME];

export const CUSTOM_EVENTS = {
  UPDATE_BIBLE_TRANSLATION: "UPDATE_BIBLE_TRANSLATION",
  UPDATE_BIBLE_VERSE: "UPDATE_BIBLE_VERSE",
  UPDATE_RECITED_BIBLE_VERSE: "UPDATE_RECITED_BIBLE_VERSE",
  NAVIGATE_TO_PAGE: "NAVIGATE_TO_PAGE",
} as const;

export type CustomEvents = keyof typeof CUSTOM_EVENTS;

export const BASE_URL = "/memorize-bible-verses";

export const PAGE_URLS = {
  INSTRUCTIONS_PAGE: `${BASE_URL}/instructions/`,
  SEARCH_OPTIONS_PAGE: `${BASE_URL}/search-options/`,
  SEARCH_VERSE_OF_THE_DAY_PAGE: `${BASE_URL}/search-verse-of-the-day/`,
  SEARCH_VERSES_FOR_SHARING_THE_GOSPEL_PAGE: `${BASE_URL}/search-verses-for-sharing-the-gospel/`,
  SEARCH_PSALM_23_PAGE: `${BASE_URL}/search-psalm-23/`,
  SEARCH_VERSES_FOR_AWANA_PAGE: `${BASE_URL}/search-verses-for-awana/`,
  SEARCH_ADVANCED_PAGE: `${BASE_URL}/search-advanced/`,
  SPEAK_VERSE_FROM_MEMORY_PAGE: `${BASE_URL}/speak-verse-from-memory/`,
  TYPE_VERSE_FROM_MEMORY_PAGE: `${BASE_URL}/type-verse-from-memory/`,
  SCORE_PAGE: `${BASE_URL}/score/`,
} as const;

export type PageURLs = keyof typeof PAGE_URLS;

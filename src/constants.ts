export const LOADING_STATES = {
  INITIAL: "INITIAL",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;

export type LoadingStates = keyof typeof LOADING_STATES;

export const CUSTOM_EVENTS = {
  UPDATE_BIBLE_TRANSLATION: "UPDATE_BIBLE_TRANSLATION",
  UPDATE_BIBLE_VERSE: "UPDATE_BIBLE_VERSE",
  UPDATE_RECITED_BIBLE_VERSE: "UPDATE_RECITED_BIBLE_VERSE",
  NAVIGATE_TO_PAGE: "NAVIGATE_TO_PAGE",
  SEARCH_FOR_BIBLE_VERSE: "SEARCH_FOR_BIBLE_VERSE",
} as const;

export type CustomEvents = keyof typeof CUSTOM_EVENTS;

export const WEB_COMPONENT_PAGES = {
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

export type WebComponentPages = keyof typeof WEB_COMPONENT_PAGES;

export const MEMORIZE_BIBLE_VERSES_API_BASE_URL =
  import.meta.env.VITE_MEMORIZE_BIBLE_VERSES_API_BASE_URL ??
  "https://memorize-bible-verses-api-server.fly.dev";

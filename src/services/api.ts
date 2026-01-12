import { BibleTranslationArraySchema } from "../schemas/bible-translation-schema";
import { BibleVerseSchema } from "../schemas/bible-verse-schema";
import { VerseOfTheDayListArraySchema } from "../schemas/verse-of-the-day-list-schema";

const API_BASE_URL =
  import.meta.env.VITE_MEMORIZE_BIBLE_VERSES_API_BASE_URL ??
  "https://memorize-bible-verses-api-server.fly.dev";

const APPLICATION_USER_ID =
  import.meta.env.VITE_MEMORIZE_BIBLE_VERSES_API_APPLICATION_USER_ID ??
  "memorize_bible_verses_web_app";

const cache = new Map<string, Promise<Response>>();

type CreateCacheKeyOptions = {
  url: string;
  options: Record<string, string | number | boolean>;
};

function createCacheKey({ url, options }: CreateCacheKeyOptions) {
  return `${url}_${JSON.stringify(options)}`;
}

async function resolveResponseToJSON(responsePromise: Promise<Response>) {
  const response = await responsePromise;
  if (!response.ok) {
    if (response.status === 400) {
      const { errorDescription } = await response.clone().json();
      throw new Error(errorDescription);
    }
    throw new Error(`response status: ${response.status}`);
  }

  const json = await response.clone().json();
  return json as unknown;
}

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

type FetchBibleTranslationsOptions = {
  // string of bible ids that are comma separated
  ids: string;
  language: string;
  includeFullDetails: boolean;
};

export async function fetchBibleTranslationsWithCache({
  language,
  ids,
  includeFullDetails,
}: FetchBibleTranslationsOptions) {
  const url = `${API_BASE_URL}/api/v1/bibles`;
  const cacheKey = createCacheKey({
    url,
    options: { language, ids, includeFullDetails },
  });
  const cacheResult = cache.get(cacheKey);
  let responsePromise: Promise<Response>;

  if (cacheResult) {
    responsePromise = cacheResult;
  } else {
    responsePromise = fetch(url, {
      method: "POST",
      body: JSON.stringify({
        language,
        ids,
        includeFullDetails,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-User-Id": APPLICATION_USER_ID,
      },
    });
    cache.set(cacheKey, responsePromise);
  }

  try {
    const jsonData = await resolveResponseToJSON(responsePromise);
    assert(
      jsonData && typeof jsonData === "object" && "data" in jsonData,
      'expected Bible Translations API to return an object containing a "data" key',
    );

    return BibleTranslationArraySchema.parse(jsonData.data);
  } catch (error) {
    cache.delete(cacheKey);
    throw error;
  }
}

type FetchBibleVerseOptions = {
  bibleId: string;
  verseReference: string;
  includeTitles: boolean;
};

export async function fetchBibleVerseWithCache({
  bibleId,
  verseReference,
  includeTitles,
}: FetchBibleVerseOptions) {
  const url = `${API_BASE_URL}/api/v1/bibles/${bibleId}/passages/verse-reference`;
  const cacheKey = createCacheKey({
    url,
    options: { verseReference, includeTitles },
  });
  const cacheResult = cache.get(cacheKey);
  let responsePromise: Promise<Response>;

  if (cacheResult) {
    responsePromise = cacheResult;
  } else {
    responsePromise = fetch(url, {
      method: "POST",
      body: JSON.stringify({
        verseReference,
        includeTitles,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-User-Id": APPLICATION_USER_ID,
      },
    });

    cache.set(cacheKey, responsePromise);
  }
  try {
    const jsonData = await resolveResponseToJSON(responsePromise);
    assert(
      jsonData && typeof jsonData === "object" && "data" in jsonData,
      "expected Bible Verse API to return an object",
    );
    return BibleVerseSchema.parse(jsonData.data);
  } catch (error) {
    cache.delete(cacheKey);
    throw error;
  }
}

type FetchBibleVerseOfTheDayOptions = {
  bibleId: string;
  // ISO8601 date with timezone offset
  date: string;
};

export async function fetchBibleVerseOfTheDayWithCache({
  bibleId,
  date,
}: FetchBibleVerseOfTheDayOptions) {
  const url = `${API_BASE_URL}/api/v1/bibles/${bibleId}/verse-of-the-day`;
  const cacheKey = createCacheKey({
    url,
    options: { date },
  });
  const cacheResult = cache.get(cacheKey);
  let responsePromise: Promise<Response>;

  if (cacheResult) {
    responsePromise = cacheResult;
  } else {
    responsePromise = fetch(url, {
      method: "POST",
      body: JSON.stringify({
        date,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-User-Id": APPLICATION_USER_ID,
      },
    });

    cache.set(cacheKey, responsePromise);
  }

  try {
    const jsonData = await resolveResponseToJSON(responsePromise);
    assert(
      jsonData && typeof jsonData === "object" && "data" in jsonData,
      'expected Verse of the Day API to return an object containing a "data" key',
    );

    return BibleVerseSchema.parse(jsonData.data);
  } catch (error) {
    cache.delete(cacheKey);
    throw error;
  }
}

type FetchVerseOfTheDayVerseListOptions = {
  year: string;
};

export async function fetchVerseOfTheDayVerseListWithCache({
  year,
}: FetchVerseOfTheDayVerseListOptions) {
  const url = `${API_BASE_URL}/api/v1/verse-of-the-day/verse-list`;
  const cacheKey = createCacheKey({
    url,
    options: { year },
  });
  const cacheResult = cache.get(cacheKey);
  let responsePromise: Promise<Response>;

  if (cacheResult) {
    responsePromise = cacheResult;
  } else {
    responsePromise = fetch(url, {
      method: "POST",
      body: JSON.stringify({
        year,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-User-Id": APPLICATION_USER_ID,
      },
    });

    cache.set(cacheKey, responsePromise);
  }
  try {
    const jsonData = await resolveResponseToJSON(responsePromise);
    assert(
      jsonData && Array.isArray(jsonData),
      "expected Verse of the Day List API to return an array",
    );
    return VerseOfTheDayListArraySchema.parse(jsonData);
  } catch (error) {
    cache.delete(cacheKey);
    throw error;
  }
}

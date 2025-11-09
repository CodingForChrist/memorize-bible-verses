import { MEMORIZE_BIBLE_VERSES_API_BASE_URL } from "../constants";
import type { BibleTranslation, BibleVerse } from "../types";

const cache = new Map<string, Promise<Response>>();

type CreateCacheKeyOptions = {
  url: string;
  options: Record<string, string | number | boolean>;
};

function createCacheKey({ url, options }: CreateCacheKeyOptions) {
  return `${url}_${JSON.stringify(options)}`;
}

async function resolveResponseToJSON<T>(
  responsePromise: Promise<Response>,
): Promise<T> {
  const response = await responsePromise;
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }

  const json = await response.clone().json();
  return json as T;
}

type FetchBibleTranslationsOptions = {
  // string of bible ids that are comma separated
  ids: string;
  language: string;
  includeFullDetails: boolean;
};

type FetchBibleTranslationsResponseBody = {
  data: BibleTranslation[];
};

export async function fetchBibleTranslationsWithCache({
  language,
  ids,
  includeFullDetails,
}: FetchBibleTranslationsOptions) {
  const url = `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles`;
  const cacheKey = createCacheKey({
    url,
    options: { language, ids, includeFullDetails },
  });
  const cacheResult = cache.get(cacheKey);

  if (cacheResult) {
    return resolveResponseToJSON<FetchBibleTranslationsResponseBody>(
      cacheResult,
    );
  }

  let responsePromise: Promise<Response>;

  responsePromise = fetch(url, {
    method: "POST",
    body: JSON.stringify({
      language,
      ids,
      includeFullDetails,
    }),
    headers: {
      "Content-Type": "application/json",
      "Application-User-Id": "memorize_bible_verses_web_app",
    },
  });

  cache.set(cacheKey, responsePromise);

  try {
    const data =
      await resolveResponseToJSON<FetchBibleTranslationsResponseBody>(
        responsePromise,
      );
    return data;
  } catch (error) {
    cache.delete(cacheKey);
    throw new Error(`failed to fetch bibles: ${error}`);
  }
}

type FetchBibleVerseOptions = {
  bibleId: string;
  verseReference: string;
};

type FetchBibleVerseResponseBody = {
  data: BibleVerse;
};

export async function fetchBibleVerseWithCache({
  bibleId,
  verseReference,
}: FetchBibleVerseOptions) {
  const url = `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles/${bibleId}/passages/verse-reference`;
  const cacheKey = createCacheKey({
    url,
    options: { verseReference },
  });
  const cacheResult = cache.get(cacheKey);

  if (cacheResult) {
    return resolveResponseToJSON<FetchBibleVerseResponseBody>(cacheResult);
  }

  let responsePromise: Promise<Response>;

  responsePromise = fetch(url, {
    method: "POST",
    body: JSON.stringify({
      verseReference,
    }),
    headers: {
      "Content-Type": "application/json",
      "Application-User-Id": "memorize_bible_verses_web_app",
    },
  });

  cache.set(cacheKey, responsePromise);

  try {
    const data =
      await resolveResponseToJSON<FetchBibleVerseResponseBody>(responsePromise);
    return data;
  } catch (error) {
    cache.delete(cacheKey);
    throw new Error(`failed to fetch bible verse: ${error}`);
  }
}

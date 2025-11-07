import { MEMORIZE_BIBLE_VERSES_API_BASE_URL } from "../constants";
import type { BibleTranslation } from "../types";

const cache = new Map<string, Promise<Response>>();

type CreateCacheKeyOptions = {
  url: string;
  options: Record<string, string | number | boolean>;
};

function createCacheKey({ url, options }: CreateCacheKeyOptions) {
  return `${url}_${JSON.stringify(options)}`;
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

export function fetchBibleTranslationsWithCache({
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

  const responsePromise = fetch(
    `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles`,
    {
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
    },
  );

  cache.set(cacheKey, responsePromise);

  return resolveResponseToJSON<FetchBibleTranslationsResponseBody>(
    responsePromise,
  );
}

async function resolveResponseToJSON<T>(
  responsePromise: Promise<Response>,
): Promise<T> {
  const response = await responsePromise;
  const json = await response.clone().json();
  return json as T;
}

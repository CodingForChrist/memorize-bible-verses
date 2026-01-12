import { z } from "zod";

import { findBibleTranslationById } from "../data/bible-translation-model";

const BibleTranslationCustomSchema = z.object({
  id: z.string().min(10),
  abbreviation: z.string().min(3),
  name: z.string().min(10),
  citationText: z.string().min(10),
  citationLink: z.string().optional(),
});

export const BibleTranslationSchema = z
  .object({
    id: z.string().min(10),
  })
  .transform(({ id }) => {
    // merges custom bible-translations.json data with
    // api response to support standardized labels and citations
    return BibleTranslationCustomSchema.parse(findBibleTranslationById(id));
  });

export const BibleTranslationArraySchema = z.array(BibleTranslationSchema);

export type BibleTranslation = z.infer<typeof BibleTranslationSchema>;
export type BibleTranslations = z.infer<typeof BibleTranslationArraySchema>;

import { z } from "zod";

const BibleTranslationSchema = z.object({
  id: z.string().min(10),
  abbreviation: z.string().min(3),
  name: z.string().min(10),
  citationText: z.string().min(10),
  citationLink: z.string().optional(),
});

export const BibleTranslationArraySchema = z.array(BibleTranslationSchema);

export type BibleTranslation = z.infer<typeof BibleTranslationSchema>;
export type BibleTranslations = z.infer<typeof BibleTranslationArraySchema>;

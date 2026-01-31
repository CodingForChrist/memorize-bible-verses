import { z } from "zod";

import { findBibleTranslationById } from "../data/bible-translation-model";
import {
  convertBibleVerseContentToText,
  standardizeVerseReference,
} from "./bible-verse-format-api-response";

const BaseBibleVerseContentItemSchema = z.object({
  type: z.enum(["tag", "text"]),
  name: z.enum(["para", "verse", "verse-span", "char", "ref"]).optional(),
  text: z.string().optional(),
  attrs: z
    .object({
      style: z.string().optional(),
      id: z.string().optional(),
      number: z.string().optional(),
      sid: z.string().optional(),
      vid: z.string().optional(),
      verseId: z.string().optional(),
      verseOrgIds: z.array(z.string()).optional(),
    })
    .optional(),
});

export type BibleVerseContentItem = {
  type: "tag" | "text";
  name?: "para" | "verse" | "verse-span" | "char" | "ref";
  text?: string;
  items?: BibleVerseContentItem[];
  attrs?: {
    style?: string;
    id?: string;
    number?: string;
    sid?: string;
    vid?: string;
    verseId?: string;
    verseOrgIds?: string[];
  };
};

export const BibleVerseContentItemSchema: z.ZodType<BibleVerseContentItem> =
  BaseBibleVerseContentItemSchema.extend({
    items: z.lazy(() => BibleVerseContentItemSchema.array().optional()),
  });

export const BibleVerseSchema = z
  .object({
    id: z.string().min(5),
    bibleId: z.string().min(10),
    reference: z.string().min(5),
    content: z.array(BibleVerseContentItemSchema),
    verseCount: z.number(),
  })
  .transform((data) => {
    const { content, reference, bibleId } = data;
    const textContent = convertBibleVerseContentToText(content);
    const { citationText, citationLink } = findBibleTranslationById(bibleId);
    return {
      ...data,
      textContent,
      citationText,
      citationLink,
      reference: standardizeVerseReference(reference),
    };
  });

export type BibleVerse = z.infer<typeof BibleVerseSchema>;

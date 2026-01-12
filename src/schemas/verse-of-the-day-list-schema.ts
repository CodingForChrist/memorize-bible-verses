import { z } from "zod";

export const VerseOfTheDayListSchema = z.object({
  verse: z.string().min(5),
  date: z.iso.date(),
  formattedDate: z.string().min(10),
  plan: z.string().optional(),
  description: z.string().optional(),
});

export const VerseOfTheDayListArraySchema = z.array(VerseOfTheDayListSchema);

export type VerseOfTheDayList = z.infer<typeof VerseOfTheDayListSchema>;

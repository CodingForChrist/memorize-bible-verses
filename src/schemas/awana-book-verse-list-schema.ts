import { z } from "zod";

const AwanaVerseSchema = z.object({
  verseReference: z.string().min(5),
  section: z.string().min(3),
});

export const AwanaBookVerseListSchema = z.object({
  id: z.string(),
  title: z.string(),
  ageGroup: z.enum(["Cubbies", "Sparks", "T&T"]),
  itemNumber: z.string(),
  link: z.string(),
  verseList: z.array(AwanaVerseSchema),
});

export type AwanaBookVerseList = z.infer<typeof AwanaBookVerseListSchema>;

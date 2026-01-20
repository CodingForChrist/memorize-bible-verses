import { z } from "zod";

import { oldTestamentBooks, newTestamentBooks } from "../data/bible-books.json";

const VerseReferenceCustomSchema = z
  .object({
    bookNumber: z.number().min(1).max(3).optional(),
    bookName: z.string().min(3),
    fullBookName: z.enum(
      [...oldTestamentBooks, ...newTestamentBooks, "Psalm", "Revelations"],
      {
        error: () => "Invalid book name",
      },
    ),
    chapter: z.number().min(1),
    verseNumberStart: z.number().min(1),
    verseNumberEnd: z.number().min(1),
  })
  .transform((data) => {
    const { verseNumberStart, verseNumberEnd } = data;

    return {
      ...data,
      verseCount: 1 + verseNumberEnd - verseNumberStart,
    };
  });

export const VerseReferenceSchema = z
  .string()
  .min(6)
  .max(40)
  .regex(/^[a-zA-Z0-9:\s-]+$/, {
    message: "Must contain letters, numbers, spaces, colons, or dashes",
  })
  .transform((verseReference, context) => {
    let parsedVerseReference;
    try {
      parsedVerseReference = parseVerseReferenceIntoParts(verseReference);
    } catch (error) {
      context.addIssue({
        code: "custom",
        message: (error as Error).message,
        input: verseReference,
      });
      return z.NEVER;
    }

    const { success, error, data } =
      VerseReferenceCustomSchema.safeParse(parsedVerseReference);
    if (success) {
      return data;
    }

    for (const { message, input } of error.issues) {
      context.addIssue({
        message,
        code: "custom",
        input,
      });
    }

    return z.NEVER;
  });

export type VerseReference = z.infer<typeof VerseReferenceSchema>;

function parseVerseReferenceIntoParts(verseReference: string) {
  let bookNumber;
  let verseReferenceWithoutBookNumber = verseReference;

  // get book number
  if (Number.isInteger(Number(verseReference.charAt(0)))) {
    if (verseReference.charAt(1) !== " ") {
      throw new Error("Book number must be a single digit followed by a space");
    }

    verseReferenceWithoutBookNumber = verseReference.slice(1).trim();
    bookNumber = Number(verseReference.charAt(0));
  }

  // get book name
  const bookNameRegExpMatchArray =
    verseReferenceWithoutBookNumber.match(/[a-zA-Z ]+/);
  if (!bookNameRegExpMatchArray) {
    throw new Error("Failed to parse book name out of the verse reference");
  }
  const bookName = bookNameRegExpMatchArray[0].trim();
  const fullBookName = bookNumber ? `${bookNumber} ${bookName}` : bookName;

  if (verseReference.charAt(fullBookName.length) !== " ") {
    throw new Error(
      "Must include a single space to separate the book name from the chapter",
    );
  }

  // get chapter and verse
  const chapterAndVerses = verseReferenceWithoutBookNumber
    .split(bookName)[1]
    .trim();

  if (chapterAndVerses.match(/:/g)?.length !== 1) {
    throw new Error(
      "Must include a single colon character to separate the chapter from the verse",
    );
  }

  const [chapter, verseResult] = chapterAndVerses.split(":");
  const [verseNumberStart, verseNumberEnd] = verseResult.includes("-")
    ? verseResult.split("-")
    : [verseResult, verseResult];

  if (!verseNumberStart || !Number.isInteger(Number(verseNumberStart))) {
    throw new Error("Invalid verse number");
  }

  return {
    fullBookName: toTitleCase(fullBookName),
    bookName: toTitleCase(bookName),
    bookNumber,
    chapter: Number(chapter),
    verseNumberStart: Number(verseNumberStart),
    verseNumberEnd: Number(verseNumberEnd),
  };
}

function toTitleCase(value: string) {
  const lowerCaseValue = value.toLowerCase();
  const titleCasedWords = lowerCaseValue.split(" ").map((word) => {
    if (word === "of") {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return titleCasedWords.join(" ");
}

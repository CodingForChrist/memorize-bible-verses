import { describe, expect, test } from "vitest";
import { ZodError } from "zod";

import { VerseOfTheDayListArraySchema } from "./verse-of-the-day-list-schema";

describe("VerseOfTheDayListArraySchema", () => {
  test("should successfully parse input", () => {
    const verseOfTheDayList = [
      {
        verse: "Revelation 4:11",
        date: "2026-01-01",
        formattedDate: "Thursday, January 1, 2026",
      },
      {
        verse: "Colossians 1:16",
        date: "2026-01-02",
        formattedDate: "Friday, January 2, 2026",
      },
    ];

    expect(VerseOfTheDayListArraySchema.parse(verseOfTheDayList)).toEqual([
      {
        verse: "Revelation 4:11",
        date: "2026-01-01",
        formattedDate: "Thursday, January 1, 2026",
      },
      {
        verse: "Colossians 1:16",
        date: "2026-01-02",
        formattedDate: "Friday, January 2, 2026",
      },
    ]);
  });
  test("should throw a validation error", () => {
    const invalidVerseOfTheDayList = [
      {
        verse: "Revelation 4:11",
        // invalid date format
        date: "2026-01",
        formattedDate: "Thursday, January 1, 2026",
      },
    ];

    expect(() => {
      VerseOfTheDayListArraySchema.parse(invalidVerseOfTheDayList);
    }).toThrowError(ZodError);
  });
});

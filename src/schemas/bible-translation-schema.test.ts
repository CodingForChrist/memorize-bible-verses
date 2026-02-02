import { describe, expect, test } from "vitest";
import { ZodError } from "zod";

import { BibleTranslationArraySchema } from "./bible-translation-schema";

describe("BibleTranslationArraySchema", () => {
  test("should successfully parse input", () => {
    const bibleTranslations = [
      {
        id: "bba9f40183526463-01",
        abbreviation: "BSB",
        name: "BSB - Berean Standard Bible",
        citationText:
          "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain.",
        citationLink: "https://berean.bible/",
      },
      {
        id: "63097d2a0a2f7db3-01",
        abbreviation: "NKJV",
        name: "NKJV - New King James Version",
        citationText:
          "New King James Version®, Copyright © 1982, Thomas Nelson. All rights reserved.",
        citationLink: "https://www.harpercollins.com/",
      },
    ];

    expect(BibleTranslationArraySchema.parse(bibleTranslations)).toEqual([
      {
        id: "bba9f40183526463-01",
        abbreviation: "BSB",
        name: "BSB - Berean Standard Bible",
        citationText:
          "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain.",
        citationLink: "https://berean.bible/",
      },
      {
        id: "63097d2a0a2f7db3-01",
        abbreviation: "NKJV",
        name: "NKJV - New King James Version",
        citationText:
          "New King James Version®, Copyright © 1982, Thomas Nelson. All rights reserved.",
        citationLink: "https://www.harpercollins.com/",
      },
    ]);
  });

  test("should throw a validation error", () => {
    const invalidBibleTranslations = [
      {
        // too short
        id: "630",
      },
    ];

    expect(() => {
      BibleTranslationArraySchema.parse(invalidBibleTranslations);
    }).toThrowError(ZodError);
  });
});

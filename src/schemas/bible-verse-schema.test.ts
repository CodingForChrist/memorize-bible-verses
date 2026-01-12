import { describe, expect, test } from "vitest";
import { ZodError } from "zod";

import { BibleVerseSchema } from "./bible-verse-schema";

describe("BibleVerseSchema", () => {
  test("should successfully parse input", () => {
    const mockBibleVerseJohnChapter3Verse16 = {
      id: "JHN.3.16",
      orgId: "JHN.3.16",
      bibleId: "bba9f40183526463-01",
      bookId: "JHN",
      chapterIds: ["JHN.3"],
      reference: "John 3:16",
      content: [
        { name: "para", type: "tag", attrs: { style: "b" }, items: [] },
        {
          name: "para",
          type: "tag",
          attrs: { style: "m" },
          items: [
            {
              name: "verse",
              type: "tag",
              attrs: { number: "16", style: "v", sid: "JHN 3:16" },
              items: [{ text: "16", type: "text" }],
            },
            {
              text: "For God so loved the world that He gave His one and only ",
              type: "text",
              attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
            },
            {
              text: " Son, that everyone who believes in Him shall not perish but have eternal life. ",
              type: "text",
              attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
            },
          ],
        },
      ],
      verseCount: 1,
      copyright:
        "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain",
    };

    expect(BibleVerseSchema.parse(mockBibleVerseJohnChapter3Verse16)).toEqual({
      id: "JHN.3.16",
      reference: "John 3:16",
      bibleId: "bba9f40183526463-01",
      verseCount: 1,
      textContent:
        "For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.",
      citationLink: "https://berean.bible/",
      citationText:
        "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain.",
      content: [
        {
          attrs: {
            style: "b",
          },
          items: [],
          name: "para",
          type: "tag",
        },
        {
          attrs: {
            style: "m",
          },
          items: [
            {
              attrs: {
                number: "16",
                sid: "JHN 3:16",
                style: "v",
              },
              items: [
                {
                  text: "16",
                  type: "text",
                },
              ],
              name: "verse",
              type: "tag",
            },
            {
              attrs: {
                verseId: "JHN.3.16",
                verseOrgIds: ["JHN.3.16"],
              },
              text: "For God so loved the world that He gave His one and only ",
              type: "text",
            },
            {
              attrs: {
                verseId: "JHN.3.16",
                verseOrgIds: ["JHN.3.16"],
              },
              text: " Son, that everyone who believes in Him shall not perish but have eternal life. ",
              type: "text",
            },
          ],
          name: "para",
          type: "tag",
        },
      ],
    });
  });
  test("should throw a validation error", () => {
    const mockBibleVerseJohnChapter3Verse16 = {
      id: "JHN.3.16",
      orgId: "JHN.3.16",
      bibleId: "bba9f40183526463-01",
      bookId: "JHN",
      chapterIds: ["JHN.3"],
      reference: "John 3:16",
      // missing content array
      verseCount: 1,
      copyright:
        "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain",
    };

    expect(() => {
      BibleVerseSchema.parse(mockBibleVerseJohnChapter3Verse16);
    }).toThrowError(ZodError);
  });
});

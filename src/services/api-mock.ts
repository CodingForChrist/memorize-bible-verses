import { vi } from "vitest";

export const mockBibleTranslations = [
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

const mockBibleVerseJohnChapter3Verse16 = {
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
};

export const verseOfTheDayVerseList = [
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
  {
    verse: "Luke 19:38",
    date: "2026-01-03",
    formattedDate: "Saturday, January 3, 2026",
  },
];

export const mockApiModule = {
  fetchBibleTranslationsWithCache: vi
    .fn()
    .mockResolvedValue(mockBibleTranslations),
  fetchBibleVerseWithCache: vi
    .fn()
    .mockResolvedValue(mockBibleVerseJohnChapter3Verse16),
  fetchBibleVerseOfTheDayWithCache: vi
    .fn()
    .mockResolvedValue(mockBibleVerseJohnChapter3Verse16),
  fetchVerseOfTheDayVerseListWithCache: vi
    .fn()
    .mockResolvedValue(verseOfTheDayVerseList),
};

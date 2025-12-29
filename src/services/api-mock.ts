import { vi } from "vitest";

export const mockBibleTranslations = {
  data: [
    {
      id: "bba9f40183526463-01",
      name: "Berean Standard Bible",
      nameLocal: "English: Berean Standard Bible",
      abbreviation: "BSB",
      abbreviationLocal: "BSB",
      description: "Berean Standard Bible",
      descriptionLocal: "English: Berean Standard Bible",
    },
    {
      id: "63097d2a0a2f7db3-01",
      name: "New King James Version",
      nameLocal: "New King James Version",
      abbreviation: "NKJV",
      abbreviationLocal: "NKJV",
      description: "English: New King James Version Old and New Testament",
      descriptionLocal: "English: New King James Version Old and New Testament",
    },
  ],
};

const mockBibleVerseJohnChapter3Verse16 = {
  data: {
    id: "JHN.3.16",
    orgId: "JHN.3.16",
    bibleId: "bba9f40183526463-01",
    bookId: "JHN",
    chapterIds: ["JHN.3"],
    reference: "John 3:16",
    content:
      '<p class="b"></p><p class="m"><span data-number="16" data-sid="JHN 3:16" class="v">16</span>For God so loved the world that He gave His one and only  Son, that everyone who believes in Him shall not perish but have eternal life. </p>',
    verseCount: 1,
    copyright:
      "The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee. This text of God's Word has been dedicated to the public domain",
  },
};

export const mockVerseOfTheDaySecondPeterChapter3Verse7 = {
  data: {
    id: "2PE.3.7",
    orgId: "2PE.3.7",
    bibleId: "63097d2a0a2f7db3-01",
    bookId: "2PE",
    chapterIds: ["2PE.3"],
    reference: "II Peter 3:7",
    content:
      '<p class="p"><span data-number="7" data-sid="2PE 3:7" class="v">7</span>But the heavens and the earth <span class="it">which</span> are now preserved by the same word, are reserved for fire until the day of judgment and perdition of ungodly men.</p>',
    verseCount: 1,
    copyright:
      "New King James Version®, Copyright© 1982, Thomas Nelson. All rights reserved.",
  },
  formattedDate: "November 26, 2025 2:49 PM",
  dayOfTheYear: 330,
  verseReference: "2 Peter 3:7",
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
    .mockResolvedValue(mockVerseOfTheDaySecondPeterChapter3Verse7),
  fetchVerseOfTheDayVerseListWithCache: vi
    .fn()
    .mockResolvedValue(verseOfTheDayVerseList),
};

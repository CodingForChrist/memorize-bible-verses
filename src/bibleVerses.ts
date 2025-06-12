const fixtureData = {
  KJV: {
    id: "de4e12af7f28f599-02",
    name: "King James (Authorised) Version",
    nameLocal: "King James Version",
    abbreviation: "engKJV",
    abbreviationLocal: "KJV",
    description: "Protestant",
    verses: [
      {
        reference: "Psalms 139:14",
        verseId: "PSA.139.14",
        verseText:
          "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
      },
      {
        reference: "John 1:1",
        verseId: "JHN.1.1",
        verseText:
          "In the beginning was the Word, and the Word was with God, and the Word was God.",
      },
      {
        reference: "Galatians 2:20",
        verseId: "GAL.2.20",
        verseText:
          "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.",
      },
      {
        reference: "1 John 1:9",
        verseId: "1JN.1.9",
        verseText:
          "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
      },
    ],
  },
  WEBUS: {
    id: "32664dc3288a28df-02",
    name: "World English Bible, American English Edition, without Strong's Numbers",
    nameLocal:
      "World English Bible, American English Edition, without Strong's Numbers",
    abbreviation: "engWEBUS",
    abbreviationLocal: "WEBUS",
    description: "Protestant",
    verses: [
      {
        reference: "Psalms 139:14",
        verseId: "PSA.139.14",
        verseText:
          "I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.",
      },
      {
        reference: "John 1:1",
        verseId: "JHN.1.1",
        verseText:
          "In the beginning was the Word, and the Word was with God, and the Word was God.",
      },
      {
        reference: "Galatians 2:20",
        verseId: "GAL.2.20",
        verseText:
          "I have been crucified with Christ, and it is no longer I who live, but Christ lives in me. That life which I now live in the flesh, I live by faith in the Son of God, who loved me and gave himself up for me.",
      },
      {
        reference: "1 John 1:9",
        verseId: "1JN.1.9",
        verseText:
          "If we confess our sins, he is faithful and righteous to forgive us the sins and to cleanse us from all unrighteousness.",
      },
    ],
  },
};

export type BibleAbbreviationLocal = "KJV" | "WEBUS";

export function getBibleVerses(bibleAbbreviationLocal: BibleAbbreviationLocal) {
  return fixtureData[bibleAbbreviationLocal].verses;
}

export function getAllBibles() {
  const { KJV, WEBUS } = fixtureData;

  return [
    {
      id: KJV.id,
      nameLocal: KJV.nameLocal,
      abbreviationLocal: KJV.abbreviationLocal,
    },
    {
      id: WEBUS.id,
      nameLocal: WEBUS.nameLocal,
      abbreviationLocal: WEBUS.abbreviationLocal,
    },
  ];
}

export function getVerseText(
  bibleAbbreviationLocal: BibleAbbreviationLocal,
  verseId: string,
) {
  const foundVerseObject = fixtureData[bibleAbbreviationLocal].verses.find(
    (verseObject) => verseObject.verseId === verseId,
  );

  if (foundVerseObject) {
    const { verseText, reference } = foundVerseObject;
    return `${reference} ${verseText} ${reference}`;
  }

  throw new Error("Failed to find verse");
}

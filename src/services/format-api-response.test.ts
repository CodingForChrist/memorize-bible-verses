import { describe, expect, test } from "vitest";
import { convertBibleVerseContentToText } from "./format-api-response";

import type { BibleVerse } from "../schemas/bible-verse-schema";

describe("convertBibleVerseContentToText()", () => {
  test("should return plain text for a single verse", () => {
    const contentJohnChapter1Verse1: BibleVerse["content"] = [
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "p",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "1",
              style: "v",
              sid: "JHN 1:1",
            },
            items: [
              {
                text: "1",
                type: "text",
              },
            ],
          },
          {
            text: "In the beginning ",
            type: "text",
            attrs: {
              verseId: "JHN.1.1",
              verseOrgIds: ["JHN.1.1"],
            },
          },
          {
            text: "was the Word, and the ",
            type: "text",
            attrs: {
              verseId: "JHN.1.1",
              verseOrgIds: ["JHN.1.1"],
            },
          },
          {
            text: "Word was ",
            type: "text",
            attrs: {
              verseId: "JHN.1.1",
              verseOrgIds: ["JHN.1.1"],
            },
          },
          {
            text: "with God, and the Word was ",
            type: "text",
            attrs: {
              verseId: "JHN.1.1",
              verseOrgIds: ["JHN.1.1"],
            },
          },
          {
            text: "God. ",
            type: "text",
            attrs: {
              verseId: "JHN.1.1",
              verseOrgIds: ["JHN.1.1"],
            },
          },
        ],
      },
    ];

    expect(convertBibleVerseContentToText(contentJohnChapter1Verse1)).toBe(
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
    );
  });

  test("should return plain text for a verse range", () => {
    const contentPsalmChapter23: BibleVerse["content"] = [
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "s1",
        },
        items: [
          {
            text: "The LORD Is My Shepherd",
            type: "text",
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "r",
        },
        items: [
          {
            text: "(",
            type: "text",
          },
          {
            name: "ref",
            type: "tag",
            attrs: {
              id: "EZK.34.11-EZK.34.24",
            },
            items: [
              {
                text: "Ezekiel 34:11–24",
                type: "text",
              },
            ],
          },
          {
            text: "; ",
            type: "text",
          },
          {
            name: "ref",
            type: "tag",
            attrs: {
              id: "JHN.10.1-JHN.10.21",
            },
            items: [
              {
                text: "John 10:1–21",
                type: "text",
              },
            ],
          },
          {
            text: ")",
            type: "text",
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "d",
        },
        items: [
          {
            text: "A Psalm of David.",
            type: "text",
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "1",
              style: "v",
              sid: "PSA 23:1",
            },
            items: [
              {
                text: "1",
                type: "text",
              },
            ],
          },
          {
            text: "The LORD is my shepherd;",
            type: "text",
            attrs: {
              verseId: "PSA.23.1",
              verseOrgIds: ["PSA.23.1"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:1",
        },
        items: [
          {
            text: "I shall not want.",
            type: "text",
            attrs: {
              verseId: "PSA.23.1",
              verseOrgIds: ["PSA.23.1"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "2",
              style: "v",
              sid: "PSA 23:2",
            },
            items: [
              {
                text: "2",
                type: "text",
              },
            ],
          },
          {
            text: "He makes me lie down in green pastures;",
            type: "text",
            attrs: {
              verseId: "PSA.23.2",
              verseOrgIds: ["PSA.23.2"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:2",
        },
        items: [
          {
            text: "He leads me beside quiet waters.",
            type: "text",
            attrs: {
              verseId: "PSA.23.2",
              verseOrgIds: ["PSA.23.2"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "3",
              style: "v",
              sid: "PSA 23:3",
            },
            items: [
              {
                text: "3",
                type: "text",
              },
            ],
          },
          {
            text: "He restores my soul;",
            type: "text",
            attrs: {
              verseId: "PSA.23.3",
              verseOrgIds: ["PSA.23.3"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:3",
        },
        items: [
          {
            text: "He guides me in the paths of righteousness",
            type: "text",
            attrs: {
              verseId: "PSA.23.3",
              verseOrgIds: ["PSA.23.3"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:3",
        },
        items: [
          {
            text: "for the sake of His name.",
            type: "text",
            attrs: {
              verseId: "PSA.23.3",
              verseOrgIds: ["PSA.23.3"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "4",
              style: "v",
              sid: "PSA 23:4",
            },
            items: [
              {
                text: "4",
                type: "text",
              },
            ],
          },
          {
            text: "Even though I walk through the valley of the shadow of death,",
            type: "text",
            attrs: {
              verseId: "PSA.23.4",
              verseOrgIds: ["PSA.23.4"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:4",
        },
        items: [
          {
            text: "I will fear no evil,",
            type: "text",
            attrs: {
              verseId: "PSA.23.4",
              verseOrgIds: ["PSA.23.4"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
          vid: "PSA 23:4",
        },
        items: [
          {
            text: "for You are with me;",
            type: "text",
            attrs: {
              verseId: "PSA.23.4",
              verseOrgIds: ["PSA.23.4"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:4",
        },
        items: [
          {
            text: "Your rod and Your staff, they comfort me.",
            type: "text",
            attrs: {
              verseId: "PSA.23.4",
              verseOrgIds: ["PSA.23.4"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "b",
        },
        items: [],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "5",
              style: "v",
              sid: "PSA 23:5",
            },
            items: [
              {
                text: "5",
                type: "text",
              },
            ],
          },
          {
            text: "You prepare a table before me",
            type: "text",
            attrs: {
              verseId: "PSA.23.5",
              verseOrgIds: ["PSA.23.5"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:5",
        },
        items: [
          {
            text: "in the presence of my enemies.",
            type: "text",
            attrs: {
              verseId: "PSA.23.5",
              verseOrgIds: ["PSA.23.5"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
          vid: "PSA 23:5",
        },
        items: [
          {
            text: "You anoint my head with oil;",
            type: "text",
            attrs: {
              verseId: "PSA.23.5",
              verseOrgIds: ["PSA.23.5"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:5",
        },
        items: [
          {
            text: "my cup overflows.",
            type: "text",
            attrs: {
              verseId: "PSA.23.5",
              verseOrgIds: ["PSA.23.5"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "6",
              style: "v",
              sid: "PSA 23:6",
            },
            items: [
              {
                text: "6",
                type: "text",
              },
            ],
          },
          {
            text: "Surely goodness and mercy will follow me",
            type: "text",
            attrs: {
              verseId: "PSA.23.6",
              verseOrgIds: ["PSA.23.6"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:6",
        },
        items: [
          {
            text: "all the days of my life,",
            type: "text",
            attrs: {
              verseId: "PSA.23.6",
              verseOrgIds: ["PSA.23.6"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q1",
          vid: "PSA 23:6",
        },
        items: [
          {
            text: "and I will dwell in the house of the LORD",
            type: "text",
            attrs: {
              verseId: "PSA.23.6",
              verseOrgIds: ["PSA.23.6"],
            },
          },
        ],
      },
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "q2",
          vid: "PSA 23:6",
        },
        items: [
          {
            text: "forever.",
            type: "text",
            attrs: {
              verseId: "PSA.23.6",
              verseOrgIds: ["PSA.23.6"],
            },
          },
        ],
      },
    ];

    expect(convertBibleVerseContentToText(contentPsalmChapter23)).toBe(
      "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside quiet waters. He restores my soul; He guides me in the paths of righteousness for the sake of His name. Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely goodness and mercy will follow me all the days of my life, and I will dwell in the house of the LORD forever.",
    );

    const contentMatthewChapter28Verses19And20: BibleVerse["content"] = [
      {
        name: "para",
        type: "tag",
        attrs: {
          style: "m",
        },
        items: [
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "19",
              style: "v",
              sid: "MAT 28:19",
            },
            items: [
              {
                text: "19",
                type: "text",
              },
            ],
          },
          {
            text: "Therefore go and make disciples ",
            type: "text",
            attrs: {
              verseId: "MAT.28.19",
              verseOrgIds: ["MAT.28.19"],
            },
          },
          {
            text: " of all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Spirit, ",
            type: "text",
            attrs: {
              verseId: "MAT.28.19",
              verseOrgIds: ["MAT.28.19"],
            },
          },
          {
            name: "verse",
            type: "tag",
            attrs: {
              number: "20",
              style: "v",
              sid: "MAT 28:20",
            },
            items: [
              {
                text: "20",
                type: "text",
              },
            ],
          },
          {
            text: "and teaching them to obey all that I have commanded you. And surely I am with you always, even to the end of the age.”",
            type: "text",
            attrs: {
              verseId: "MAT.28.20",
              verseOrgIds: ["MAT.28.20"],
            },
          },
        ],
      },
    ];

    expect(
      convertBibleVerseContentToText(contentMatthewChapter28Verses19And20),
    ).toBe(
      "Therefore go and make disciples of all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Spirit, and teaching them to obey all that I have commanded you. And surely I am with you always, even to the end of the age.”",
    );
  });
});

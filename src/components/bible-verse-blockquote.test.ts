import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { BibleVerseBlockquote } from "./bible-verse-blockquote";
import { findBibleTranslationByAbbreviation } from "../data/bible-translation-model";

function stripExpressionComments(html: string) {
  return html.replaceAll(/<!--\?lit\$[0-9]+\$-->|<!--\??-->/g, "");
}

function convertBibleVerseHTMLToText(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  for (const verseNumberElement of divElement.querySelectorAll(
    "span[data-number]",
  )) {
    verseNumberElement.remove();
  }

  const textArray = [...divElement.children].map((childElement) => {
    if (childElement.nodeName === "P") {
      const textContent = (
        childElement as HTMLParagraphElement
      ).textContent.trim();
      // browsers render two spaces as a single space
      // so its safe to ignore double spaces
      return textContent.replaceAll("  ", " ");
    }
    throw new Error(
      `Unexpected element in verse html "${childElement.nodeName}"`,
    );
  });

  console.log(textArray);

  return textArray.join(" ");
}

describe("<bible-verse-blockquote>", () => {
  let bibleVerseBlockquoteElement: BibleVerseBlockquote;

  beforeEach(() => {
    bibleVerseBlockquoteElement = document.createElement(
      "bible-verse-blockquote",
    ) as BibleVerseBlockquote;
  });

  afterEach(() => {
    bibleVerseBlockquoteElement.remove();
  });

  describe("NKJV", () => {
    const { id: bibleIdNKJV } = findBibleTranslationByAbbreviation("NKJV");

    test("should render John 3:16-17", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNKJV;
      bibleVerseBlockquoteElement.displayVerseNumbers = true;
      bibleVerseBlockquoteElement.content = [
        {
          name: "para",
          type: "tag",
          attrs: { style: "p" },
          items: [
            {
              name: "verse",
              type: "tag",
              attrs: { number: "16", style: "v", sid: "JHN 3:16" },
              items: [{ text: "16", type: "text" }],
            },
            {
              name: "char",
              type: "tag",
              attrs: { style: "wj" },
              items: [
                {
                  text: "For God so loved the world that He gave His only begotten",
                  type: "text",
                  attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
                },
              ],
            },
            {
              text: " ",
              type: "text",
              attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
            },
            {
              name: "char",
              type: "tag",
              attrs: { style: "wj" },
              items: [
                {
                  text: "Son, that whoever believes in Him should not perish but have everlasting life.",
                  type: "text",
                  attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
                },
              ],
            },
            {
              text: " ",
              type: "text",
              attrs: { verseId: "JHN.3.16", verseOrgIds: ["JHN.3.16"] },
            },
            {
              name: "verse",
              type: "tag",
              attrs: { number: "17", style: "v", sid: "JHN 3:17" },
              items: [{ text: "17", type: "text" }],
            },
            {
              name: "char",
              type: "tag",
              attrs: { style: "wj" },
              items: [
                {
                  text: "For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.",
                  type: "text",
                  attrs: { verseId: "JHN.3.17", verseOrgIds: ["JHN.3.17"] },
                },
              ],
            },
          ],
        },
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="p"><span class=" v " data-number="16" data-sid="JHN 3:16">16</span><span class="wj"><span>For God so loved the world that He gave His only begotten </span></span><span> </span><span class="wj"><span>Son, that whoever believes in Him should not perish but have everlasting life. </span></span><span> </span><span class=" v " data-number="17" data-sid="JHN 3:17">17</span><span class="wj"><span>For God did not send His Son into the world to condemn the world, but that the world through Him might be saved. </span></span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life. For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.",
      );
    });

    test("should render Revelation 4:11", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNKJV;
      bibleVerseBlockquoteElement.content = [
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
                number: "11",
                style: "v",
                sid: "REV 4:11",
              },
              items: [
                {
                  text: "11",
                  type: "text",
                },
              ],
            },
            {
              text: "“You",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
            {
              text: "are worthy, O Lord,",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
          ],
        },
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q2",
            vid: "REV 4:11",
          },
          items: [
            {
              text: "To receive glory and honor and power;",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
          ],
        },
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q2",
            vid: "REV 4:11",
          },
          items: [
            {
              text: "For You created all things,",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
          ],
        },
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q2",
            vid: "REV 4:11",
          },
          items: [
            {
              text: "And by ",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
            {
              text: "Your will they exist and were created.”",
              type: "text",
              attrs: {
                verseId: "REV.4.11",
                verseOrgIds: ["REV.4.11"],
              },
            },
          ],
        },
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="q1"><span class=" v hidden " data-number="11" data-sid="REV 4:11">11</span><span>“You </span><span>are worthy, O Lord, </span></p><p class="q2"><span>To receive glory and honor and power; </span></p><p class="q2"><span>For You created all things, </span></p><p class="q2"><span>And by </span><span>Your will they exist and were created.” </span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "“You are worthy, O Lord, To receive glory and honor and power; For You created all things, And by Your will they exist and were created.”",
      );
    });

    test("should render Acts 1:8", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNKJV;
      bibleVerseBlockquoteElement.content = [
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
                number: "8",
                style: "v",
                sid: "ACT 1:8",
              },
              items: [
                {
                  text: "8",
                  type: "text",
                },
              ],
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "wj",
              },
              items: [
                {
                  text: "But you shall receive power",
                  type: "text",
                  attrs: {
                    verseId: "ACT.1.8",
                    verseOrgIds: ["ACT.1.8"],
                  },
                },
              ],
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "wj",
              },
              items: [
                {
                  text: "when the Holy Spirit has come upon you; and",
                  type: "text",
                  attrs: {
                    verseId: "ACT.1.8",
                    verseOrgIds: ["ACT.1.8"],
                  },
                },
              ],
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "wj",
              },
              items: [
                {
                  text: "you shall be witnesses to Me in Jerusalem, and in all Judea and",
                  type: "text",
                  attrs: {
                    verseId: "ACT.1.8",
                    verseOrgIds: ["ACT.1.8"],
                  },
                },
              ],
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "wj",
              },
              items: [
                {
                  text: "Samaria, and to the",
                  type: "text",
                  attrs: {
                    verseId: "ACT.1.8",
                    verseOrgIds: ["ACT.1.8"],
                  },
                },
              ],
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "wj",
              },
              items: [
                {
                  text: "end of the earth.”",
                  type: "text",
                  attrs: {
                    verseId: "ACT.1.8",
                    verseOrgIds: ["ACT.1.8"],
                  },
                },
              ],
            },
          ],
        },
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="p"><span class=" v hidden " data-number="8" data-sid="ACT 1:8">8</span><span class="wj"><span>But you shall receive power </span></span><span class="wj"><span>when the Holy Spirit has come upon you; and </span></span><span class="wj"><span>you shall be witnesses to Me in Jerusalem, and in all Judea and </span></span><span class="wj"><span>Samaria, and to the </span></span><span class="wj"><span>end of the earth.” </span></span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.”",
      );
    });
  });

  describe("NASB 1995", () => {
    const { id: bibleIdNASB1995 } =
      findBibleTranslationByAbbreviation("NASB 1995");

    test("should render Psalm 23:1", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNASB1995;
      bibleVerseBlockquoteElement.content = [
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q",
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
              text: "The L",
              type: "text",
              attrs: {
                verseId: "PSA.23.1",
                verseOrgIds: ["PSA.23.1"],
              },
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "sc",
              },
              items: [
                {
                  text: "ord",
                  type: "text",
                  attrs: {
                    verseId: "PSA.23.1",
                    verseOrgIds: ["PSA.23.1"],
                  },
                },
              ],
            },
            {
              text: " is my shepherd,",
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
            style: "q",
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
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="q"><span class=" v hidden " data-number="1" data-sid="PSA 23:1">1</span><span>The L</span><span class="sc"><span>ord</span></span><span> is my shepherd,</span></p><p class="q"><span>I shall not want.</span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "The Lord is my shepherd, I shall not want.",
      );
    });

    test("should render Jeremiah 32:17", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNASB1995;
      bibleVerseBlockquoteElement.content = [
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
                number: "17",
                style: "v",
                sid: "JER 32:17",
              },
              items: [
                {
                  text: "17",
                  type: "text",
                },
              ],
            },
            {
              text: "‘Ah Lord G",
              type: "text",
              attrs: {
                verseId: "JER.32.17",
                verseOrgIds: ["JER.32.17"],
              },
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "sc",
              },
              items: [
                {
                  text: "od",
                  type: "text",
                  attrs: {
                    verseId: "JER.32.17",
                    verseOrgIds: ["JER.32.17"],
                  },
                },
              ],
            },
            {
              text: "! Behold, You have made the heavens and the earth by Your great power and by Your outstretched arm! Nothing is too difficult for You, ",
              type: "text",
              attrs: {
                verseId: "JER.32.17",
                verseOrgIds: ["JER.32.17"],
              },
            },
          ],
        },
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="p"><span class=" v hidden " data-number="17" data-sid="JER 32:17">17</span><span>‘Ah Lord G</span><span class="sc"><span>od</span></span><span>! Behold, You have made the heavens and the earth by Your great power and by Your outstretched arm! Nothing is too difficult for You, </span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "‘Ah Lord God! Behold, You have made the heavens and the earth by Your great power and by Your outstretched arm! Nothing is too difficult for You,",
      );
    });

    test("should render Luke 19:38", async () => {
      document.body.append(bibleVerseBlockquoteElement);
      bibleVerseBlockquoteElement.bibleId = bibleIdNASB1995;
      bibleVerseBlockquoteElement.content = [
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
                number: "38",
                style: "v",
                sid: "LUK 19:38",
              },
              items: [
                {
                  text: "38",
                  type: "text",
                },
              ],
            },
            {
              text: "shouting:",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
          ],
        },
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q",
            vid: "LUK 19:38",
          },
          items: [
            {
              text: "“B",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "sc",
              },
              items: [
                {
                  text: "lessed is the",
                  type: "text",
                  attrs: {
                    verseId: "LUK.19.38",
                    verseOrgIds: ["LUK.19.38"],
                  },
                },
              ],
            },
            {
              text: " K",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "sc",
              },
              items: [
                {
                  text: "ing who comes in the name of the",
                  type: "text",
                  attrs: {
                    verseId: "LUK.19.38",
                    verseOrgIds: ["LUK.19.38"],
                  },
                },
              ],
            },
            {
              text: " L",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
            {
              name: "char",
              type: "tag",
              attrs: {
                style: "sc",
              },
              items: [
                {
                  text: "ord",
                  type: "text",
                  attrs: {
                    verseId: "LUK.19.38",
                    verseOrgIds: ["LUK.19.38"],
                  },
                },
              ],
            },
            {
              text: ";",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
          ],
        },
        {
          name: "para",
          type: "tag",
          attrs: {
            style: "q",
            vid: "LUK 19:38",
          },
          items: [
            {
              text: "Peace in heaven and glory in the highest!”",
              type: "text",
              attrs: {
                verseId: "LUK.19.38",
                verseOrgIds: ["LUK.19.38"],
              },
            },
          ],
        },
      ];

      await bibleVerseBlockquoteElement.updateComplete;
      const containerElement =
        bibleVerseBlockquoteElement.shadowRoot!.querySelector(
          ".scripture-styles",
        ) as HTMLSpanElement;

      expect(stripExpressionComments(containerElement.innerHTML).trim()).toBe(
        '<p class="p"><span class=" v hidden " data-number="38" data-sid="LUK 19:38">38</span><span>shouting:</span></p><p class="q"><span>“B</span><span class="sc"><span>lessed is the</span></span><span> K</span><span class="sc"><span>ing who comes in the name of the</span></span><span> L</span><span class="sc"><span>ord</span></span><span>;</span></p><p class="q"><span>Peace in heaven and glory in the highest!”</span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "shouting: “Blessed is the King who comes in the name of the Lord; Peace in heaven and glory in the highest!”",
      );
    });
  });
});

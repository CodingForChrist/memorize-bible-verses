import { beforeEach, afterEach, describe, expect, test } from "vitest";
import { BibleVerseBlockquote } from "./bible-verse-blockquote";

function stripExpressionComments(html: string) {
  return html.replaceAll(/<!--\?lit\$[0-9]+\$-->|<!--\??-->/g, "");
}

function convertBibleVerseHTMLToText(htmlContentString: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = htmlContentString;

  for (const verseNumberElement of divElement.querySelectorAll("span.v")) {
    verseNumberElement.remove();
  }

  const textArray = [...divElement.children].map((childElement) => {
    if (childElement.nodeName === "P") {
      return (childElement as HTMLParagraphElement).textContent.trim();
    }
    throw new Error(
      `Unexpected element in verse html "${childElement.nodeName}"`,
    );
  });

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
    test("should render John 3:16-17", async () => {
      document.body.append(bibleVerseBlockquoteElement);
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
        '<p class="p"><span class=" v ">16</span><span class="wj"><span>For God so loved the world that He gave His only begotten</span></span><span> </span><span class="wj"><span>Son, that whoever believes in Him should not perish but have everlasting life.</span></span><span> </span><span class=" v ">17</span><span class="wj"><span>For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.</span></span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life. For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.",
      );
    });

    test("should render Revelation 4:11", async () => {
      document.body.append(bibleVerseBlockquoteElement);
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
        '<p class="q1"><span class=" v hidden ">11</span><span>“You </span><span>are worthy, O Lord,</span></p><p class="q2"><span>To receive glory and honor and power;</span></p><p class="q2"><span>For You created all things,</span></p><p class="q2"><span>And by </span><span>Your will they exist and were created.”</span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "“You are worthy, O Lord, To receive glory and honor and power; For You created all things, And by Your will they exist and were created.”",
      );
    });

    test("should render Acts 1:8", async () => {
      document.body.append(bibleVerseBlockquoteElement);
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
        '<p class="p"><span class=" v hidden ">8</span><span class="wj"><span>But you shall receive power</span></span><span class="wj"><span>when the Holy Spirit has come upon you; and</span></span><span class="wj"><span>you shall be witnesses to Me in Jerusalem, and in all Judea and</span></span><span class="wj"><span>Samaria, and to the</span></span><span class="wj"><span>end of the earth.”</span></span></p>',
      );

      expect(convertBibleVerseHTMLToText(containerElement.innerHTML)).toBe(
        "But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.”",
      );
    });
  });
});

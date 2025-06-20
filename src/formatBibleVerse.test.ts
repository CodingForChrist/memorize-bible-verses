import { describe, expect, test } from "vitest";

import {
  removeTitlesAndNotesFromBibleVerse,
  convertBibleVerseToText,
} from "./formatBibleVerse";

describe("removeTitlesAndNotesFromBibleVerse()", () => {
  test("should remove title and notes from a single verse", () => {
    const htmlContentString =
      '<p class="s1">The Beginning</p><p class="r">(<span id="GEN.1.1-GEN.1.2">Genesis 1:1–2</span>; <span id="HEB.11.1-HEB.11.3">Hebrews 11:1–3</span>)</p><p class="m"><span data-number="1" data-sid="JHN 1:1" class="v">1</span>In the beginning was the Word, and the Word was with God, and the Word was God. </p>';

    const results = removeTitlesAndNotesFromBibleVerse(htmlContentString);
    expect(results).toBe(
      '<p class="m"><span data-number="1" data-sid="JHN 1:1" class="v">1</span>In the beginning was the Word, and the Word was with God, and the Word was God. </p>',
    );
  });

  test("should remove title and notes from multiple verses", () => {
    const htmlContentString =
      '<p class="s1">The Witness of John</p><p class="b"></p><p class="m"><span data-number="6" data-sid="JHN 1:6" class="v">6</span>There came a man who was sent from God. His name was John. <span data-number="7" data-sid="JHN 1:7" class="v">7</span>He came as a witness to testify about the Light, so that through him everyone might believe. <span data-number="8" data-sid="JHN 1:8" class="v">8</span>He himself was not the Light, but he came to testify about the Light.</p><p class="b"></p><p class="m"><span data-number="9" data-sid="JHN 1:9" class="v">9</span>The true Light who gives light to every man was coming into the world. <span data-number="10" data-sid="JHN 1:10" class="v">10</span>He was in the world, and though the world was made through Him, the world did not recognize Him. <span data-number="11" data-sid="JHN 1:11" class="v">11</span>He came to His own, and His own did not receive Him. <span data-number="12" data-sid="JHN 1:12" class="v">12</span>But to all who did receive Him, to those who believed in His name, He gave the right to become children of God— <span data-number="13" data-sid="JHN 1:13" class="v">13</span>children born not of blood, nor of the desire or will of man, but born of God.</p><p class="s1">The Word Became Flesh</p><p class="r">(<span id="PSA.84.1-PSA.84.12">Psalms 84:1–12</span>)</p><p class="b"></p><p class="m"><span data-number="14" data-sid="JHN 1:14" class="v">14</span>The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son  from the Father, full of grace and truth.</p>';

    const results = removeTitlesAndNotesFromBibleVerse(htmlContentString);
    expect(results).toBe(
      '<p class="b"></p><p class="m"><span data-number="6" data-sid="JHN 1:6" class="v">6</span>There came a man who was sent from God. His name was John. <span data-number="7" data-sid="JHN 1:7" class="v">7</span>He came as a witness to testify about the Light, so that through him everyone might believe. <span data-number="8" data-sid="JHN 1:8" class="v">8</span>He himself was not the Light, but he came to testify about the Light.</p><p class="b"></p><p class="m"><span data-number="9" data-sid="JHN 1:9" class="v">9</span>The true Light who gives light to every man was coming into the world. <span data-number="10" data-sid="JHN 1:10" class="v">10</span>He was in the world, and though the world was made through Him, the world did not recognize Him. <span data-number="11" data-sid="JHN 1:11" class="v">11</span>He came to His own, and His own did not receive Him. <span data-number="12" data-sid="JHN 1:12" class="v">12</span>But to all who did receive Him, to those who believed in His name, He gave the right to become children of God— <span data-number="13" data-sid="JHN 1:13" class="v">13</span>children born not of blood, nor of the desire or will of man, but born of God.</p><p class="b"></p><p class="m"><span data-number="14" data-sid="JHN 1:14" class="v">14</span>The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son  from the Father, full of grace and truth.</p>',
    );
  });
});

describe("convertBibleVerseToText()", () => {
  test("should return plain text for a single verse", () => {
    const htmlContentString =
      '<p class="s1">The Beginning</p><p class="r">(<span id="GEN.1.1-GEN.1.2">Genesis 1:1–2</span>; <span id="HEB.11.1-HEB.11.3">Hebrews 11:1–3</span>)</p><p class="m"><span data-number="1" data-sid="JHN 1:1" class="v">1</span>In the beginning was the Word, and the Word was with God, and the Word was God. </p>';

    const results = convertBibleVerseToText(htmlContentString);
    expect(results).toBe(
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
    );
  });
});

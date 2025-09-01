import { describe, expect, test } from "vitest";

import {
  removeExtraContentFromBibleVerse,
  convertBibleVerseToText,
} from "./formatBibleVerseFromApi";

describe("removeExtraContentFromBibleVerse()", () => {
  test("should remove title, notes, and verse numbers from a single verse", () => {
    expect(
      removeExtraContentFromBibleVerse(
        '<p class="s1">The Beginning</p><p class="r">(<span id="GEN.1.1-GEN.1.2">Genesis 1:1–2</span>; <span id="HEB.11.1-HEB.11.3">Hebrews 11:1–3</span>)</p><p class="m"><span data-number="1" data-sid="JHN 1:1" class="v">1</span>In the beginning was the Word, and the Word was with God, and the Word was God. </p>',
      ),
    ).toBe(
      '<p class="m">In the beginning was the Word, and the Word was with God, and the Word was God. </p>',
    );

    expect(
      removeExtraContentFromBibleVerse(
        '<p class="ms2">Psalm 23</p><p class="s"><span class="it">The L<span class="sc"><span class="it">ord</span></span>, the Psalmist’s Shepherd.</span></p><p class="d">A Psalm of David.</p><p class="q">The L<span class="sc">ord</span> is my shepherd,</p><p data-vid="PSA 23:1" class="q">I will not be in need.</p>',
      ),
    ).toBe(
      '<p class="q">The L<span class="sc">ord</span> is my shepherd,</p><p data-vid="PSA 23:1" class="q">I will not be in need.</p>',
    );
  });

  test("should remove title, notes, and verse numbers from multiple verses", () => {
    const htmlContentString =
      '<p class="s1">The Witness of John</p><p class="b"></p><p class="m"><span data-number="6" data-sid="JHN 1:6" class="v">6</span>There came a man who was sent from God. His name was John. <span data-number="7" data-sid="JHN 1:7" class="v">7</span>He came as a witness to testify about the Light, so that through him everyone might believe. <span data-number="8" data-sid="JHN 1:8" class="v">8</span>He himself was not the Light, but he came to testify about the Light.</p><p class="b"></p><p class="m"><span data-number="9" data-sid="JHN 1:9" class="v">9</span>The true Light who gives light to every man was coming into the world. <span data-number="10" data-sid="JHN 1:10" class="v">10</span>He was in the world, and though the world was made through Him, the world did not recognize Him. <span data-number="11" data-sid="JHN 1:11" class="v">11</span>He came to His own, and His own did not receive Him. <span data-number="12" data-sid="JHN 1:12" class="v">12</span>But to all who did receive Him, to those who believed in His name, He gave the right to become children of God— <span data-number="13" data-sid="JHN 1:13" class="v">13</span>children born not of blood, nor of the desire or will of man, but born of God.</p><p class="s1">The Word Became Flesh</p><p class="r">(<span id="PSA.84.1-PSA.84.12">Psalms 84:1–12</span>)</p><p class="b"></p><p class="m"><span data-number="14" data-sid="JHN 1:14" class="v">14</span>The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son  from the Father, full of grace and truth.</p>';

    const results = removeExtraContentFromBibleVerse(htmlContentString);
    expect(results).toBe(
      '<p class="m">There came a man who was sent from God. His name was John. He came as a witness to testify about the Light, so that through him everyone might believe. He himself was not the Light, but he came to testify about the Light.</p><p class="b"></p><p class="m">The true Light who gives light to every man was coming into the world. He was in the world, and though the world was made through Him, the world did not recognize Him. He came to His own, and His own did not receive Him. But to all who did receive Him, to those who believed in His name, He gave the right to become children of God— children born not of blood, nor of the desire or will of man, but born of God.</p><p class="b"></p><p class="m">The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son  from the Father, full of grace and truth.</p>',
    );
  });

  test("should remove paragraph breaks from the beginning and end of a verse", () => {
    const htmlContentString =
      '<p class="b"></p><p class="m"><span data-number="6" data-sid="JHN 14:6" class="v">6</span>Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through Me. </p><p class="b"></p>';

    const results = removeExtraContentFromBibleVerse(htmlContentString);
    expect(results).toBe(
      '<p class="m">Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through Me. </p>',
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

  test("should return plain text for a verse range", () => {
    const htmlContentStringPsalm23 = `<p class="ms">PSALM 23</p><p class="s">The L<span class="sc"><span class="it">ord</span></span>, the Psalmist’s Shepherd.</p><p class="ms">A Psalm of David.</p><p class="q"><span data-number="1" data-sid="PSA 23:1" class="v">1</span>The L<span class="sc">ord</span> is my shepherd,</p><p data-vid="PSA 23:1" class="q">I shall not want.</p><p class="q"><span data-number="2" data-sid="PSA 23:2" class="v">2</span>He makes me lie down in green pastures;</p><p data-vid="PSA 23:2" class="q">He leads me beside quiet waters.</p><p class="q"><span data-number="3" data-sid="PSA 23:3" class="v">3</span>He restores my soul;</p><p data-vid="PSA 23:3" class="q">He guides me in the paths of righteousness</p><p data-vid="PSA 23:3" class="q">For His name’s sake.</p><p class="q"><span data-number="4" data-sid="PSA 23:4" class="v">4</span>Even though I walk through the valley of the shadow of death,</p><p data-vid="PSA 23:4" class="q">I fear no evil, for You are with me;</p><p data-vid="PSA 23:4" class="q">Your rod and Your staff, they comfort me.</p><p class="q"><span data-number="5" data-sid="PSA 23:5" class="v">5</span>You prepare a table before me in the presence of my enemies;</p><p data-vid="PSA 23:5" class="q">You have anointed my head with oil;</p><p data-vid="PSA 23:5" class="q">My cup overflows.</p><p class="q"><span data-number="6" data-sid="PSA 23:6" class="v">6</span>Surely goodness and lovingkindness will follow me all the days of my life,</p><p data-vid="PSA 23:6" class="q">And I will dwell in the house of the L<span class="sc">ord</span> forever.</p>"`;

    const resultsPsalm23 = convertBibleVerseToText(htmlContentStringPsalm23);
    expect(resultsPsalm23).toBe(
      "The Lord is my shepherd, I shall not want. He makes me lie down in green pastures; He leads me beside quiet waters. He restores my soul; He guides me in the paths of righteousness For His name’s sake. Even though I walk through the valley of the shadow of death, I fear no evil, for You are with me; Your rod and Your staff, they comfort me. You prepare a table before me in the presence of my enemies; You have anointed my head with oil; My cup overflows. Surely goodness and lovingkindness will follow me all the days of my life, And I will dwell in the house of the Lord forever.",
    );

    const htmlContentStringMatthew28Verses19And20 = `<p class="p"><span data-number="19" data-sid="MAT 28:19" class="v">19</span><span class="wj">Go therefore and make disciples of all the nations, baptizing them in the name of the Father and the Son and the Holy Spirit,</span> <span data-number="20" data-sid="MAT 28:20" class="v">20</span><span class="wj">teaching them to observe all that I commanded you; and lo, I am with you always, even to the end of the age.”</span></p>`;
    const resultsMatthew28Verses19And20 = convertBibleVerseToText(
      htmlContentStringMatthew28Verses19And20,
    );

    expect(resultsMatthew28Verses19And20).toBe(
      "Go therefore and make disciples of all the nations, baptizing them in the name of the Father and the Son and the Holy Spirit, teaching them to observe all that I commanded you; and lo, I am with you always, even to the end of the age.”",
    );
  });
});

import { describe, expect, test } from "vitest";

import { sortBibleVerseReferences } from "./sort-bible-verses";

describe("sortBibleVerseReferences()", () => {
  test("sort both old and new testament verses", () => {
    expect(
      sortBibleVerseReferences([
        "Psalm 9:10",
        "Deuteronomy 7:9",
        "2 Peter 3:9",
      ]),
    ).toEqual(["Deuteronomy 7:9", "Psalm 9:10", "2 Peter 3:9"]);
  });
  test("sorts same books by chapter and verse number", () => {
    expect(
      sortBibleVerseReferences([
        "Matthew 28:19-20",
        "Matthew 28:6",
        "Matthew 5:1",
      ]),
    ).toEqual(["Matthew 5:1", "Matthew 28:6", "Matthew 28:19-20"]);
  });
});

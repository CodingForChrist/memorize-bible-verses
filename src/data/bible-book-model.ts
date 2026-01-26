import bibleBooks from "./bible-books.json";

export function getAllBibleBooksGroupedByTestament() {
  return bibleBooks;
}

export function getAllBibleBooks() {
  const { oldTestamentBooks, newTestamentBooks } = bibleBooks;
  return [...oldTestamentBooks, ...newTestamentBooks];
}

export function findBibleBookByAbbreviation(abbreviation: string) {
  const abbreviationWithoutPeriod = abbreviation.endsWith(".")
    ? abbreviation.replace(/.$/, "")
    : abbreviation;

  const foundBibleBook = getAllBibleBooks().find((bibleBook) =>
    bibleBook.startsWith(abbreviationWithoutPeriod),
  );
  if (!foundBibleBook) {
    throw new Error(
      `Failed to find the bible book by abbreviation for "${abbreviation}`,
    );
  }
  return foundBibleBook;
}

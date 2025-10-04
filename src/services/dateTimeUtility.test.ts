import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

import {
  parseDate,
  formatDate,
  addDays,
  subtractDays,
} from "./dateTimeUtility";

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

const mockSystemTime = "2025-01-30 06:15:00";

beforeEach(() => {
  vi.setSystemTime(new Date(mockSystemTime));
  vi.stubEnv("TZ", "America/Chicago");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseDate()", () => {
  test("should preserve the local time", () => {
    const date = parseDate("2025-01-31", "YYYY-MM-DD");

    // should be 1 day after the system date
    expect(date.getDate()).toBe(new Date().getDate() + 1);

    expect(date.getHours()).toBe(new Date().getHours());
    expect(date.getMinutes()).toBe(new Date().getMinutes());
    expect(date.getMilliseconds()).toBe(new Date().getMilliseconds());
    expect(date.getTimezoneOffset()).toBe(new Date().getTimezoneOffset());
  });
});

describe("formatDate()", () => {
  test("should format to YYYY-MM-DD", () => {
    const formattedDate = formatDate(
      new Date("2025-12-25T23:38:04-06:00"),
      "YYYY-MM-DD",
    );
    expect(formattedDate).toBe("2025-12-25");
  });

  test("should format to dddd, MMMM D, YYYY", () => {
    const formattedDate = formatDate(
      new Date("2025-12-25T23:38:04-06:00"),
      "dddd, MMMM D, YYYY",
    );
    expect(formattedDate).toBe("Thursday, December 25, 2025");
  });

  test("should format to ISO8601", () => {
    const formattedDate = formatDate(
      new Date("2025-12-25T23:38:04-06:00"),
      "ISO8601",
    );
    expect(formattedDate).toBe("2025-12-25T23:38:04-06:00");
  });
});

describe("addDays()", () => {
  test("should add one day to first day of the month", () => {
    const firstDayOfMonth = parseDate("2025-01-01", "YYYY-MM-DD");
    const secondDayOfMonth = addDays(firstDayOfMonth, 1);

    expect(formatDate(firstDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-01");
    expect(formatDate(secondDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-02");
  });

  test("should add one day to the last day of the month", () => {
    const lastDayOfMonth = parseDate("2025-01-31", "YYYY-MM-DD");
    const firstDayOfNextMonth = addDays(lastDayOfMonth, 1);

    expect(formatDate(lastDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-31");
    expect(formatDate(firstDayOfNextMonth, "YYYY-MM-DD")).toBe("2025-02-01");
  });
});

describe("addDays()", () => {
  test("should subtract one day from the first day of the month", () => {
    const firstDayOfMonth = parseDate("2025-01-01", "YYYY-MM-DD");
    const lastDayOfPreviousMonth = subtractDays(firstDayOfMonth, 1);

    expect(formatDate(firstDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-01");
    expect(formatDate(lastDayOfPreviousMonth, "YYYY-MM-DD")).toBe("2024-12-31");
  });

  test("should subtract one day from the last day of the month", () => {
    const lastDayOfMonth = parseDate("2025-01-31", "YYYY-MM-DD");
    const secondToLastDayOfMonth = subtractDays(lastDayOfMonth, 1);

    expect(formatDate(lastDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-31");
    expect(formatDate(secondToLastDayOfMonth, "YYYY-MM-DD")).toBe("2025-01-30");
  });
});

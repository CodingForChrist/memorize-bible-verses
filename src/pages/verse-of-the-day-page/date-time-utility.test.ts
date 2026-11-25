import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";

import {
  parseDate,
  formatDate,
  addDays,
  subtractDays,
} from "./date-time-utility";

const timezoneConfig = {
  name: "America/New_York",
  offsetStandardTime: "05:00",
  offsetDaylightSavingsTime: "04:00",
};

beforeEach(() => {
  vi.stubEnv("TZ", timezoneConfig.name);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-01-30 06:15:00"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("parseDate()", () => {
  type InvalidDateTestCase = {
    label: string;
    input: string;
    expectedError: string;
  };

  test("should preserve the local time", () => {
    const now = new Date();
    const date = parseDate("2025-01-31", "YYYY-MM-DD");

    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(now.getDate() + 1);
    expect(date.getHours()).toBe(now.getHours());
    expect(date.getMinutes()).toBe(now.getMinutes());
    expect(date.getSeconds()).toBe(now.getSeconds());
    expect(date.getMilliseconds()).toBe(now.getMilliseconds());
    expect(date.getTimezoneOffset()).toBe(now.getTimezoneOffset());
  });

  test("should parse Feb 29 on a leap year", () => {
    const date = parseDate("2024-02-29", "YYYY-MM-DD");

    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(29);
  });

  test("should throw when format is unsupported", () => {
    expect(() =>
      // @ts-expect-error testing runtime check for unsupported format
      parseDate("2025-01-31", "MM/DD/YYYY"),
    ).toThrow("Unsupported date format");
  });

  test.each<InvalidDateTestCase>([
    {
      label: "non-leap year Feb 29",
      input: "2025-02-29",
      expectedError: 'Invalid calendar date: "2025-02-29"',
    },
    {
      label: "31st of a 30-day month",
      input: "2025-04-31",
      expectedError: 'Invalid calendar date: "2025-04-31"',
    },
    {
      label: "month greater than 12",
      input: "2025-13-01",
      expectedError: 'Invalid calendar date: "2025-13-01"',
    },
    {
      label: "zero month",
      input: "2025-00-10",
      expectedError: 'Invalid calendar date: "2025-00-10"',
    },
    {
      label: "zero day",
      input: "2025-01-00",
      expectedError: 'Invalid calendar date: "2025-01-00"',
    },
    {
      label: "unpadded month and day",
      input: "2025-1-5",
      expectedError:
        'Invalid date string "2025-1-5". Expected format: YYYY-MM-DD',
    },
    {
      label: "wrong separator",
      input: "2025/01/31",
      expectedError:
        'Invalid date string "2025/01/31". Expected format: YYYY-MM-DD',
    },
    {
      label: "trailing timestamp",
      input: "2025-01-31T00:00:00",
      expectedError:
        'Invalid date string "2025-01-31T00:00:00". Expected format: YYYY-MM-DD',
    },
    {
      label: "empty string",
      input: "",
      expectedError: 'Invalid date string "". Expected format: YYYY-MM-DD',
    },
  ])("should throw for $label ($input)", ({ input, expectedError }) => {
    expect(() => parseDate(input, "YYYY-MM-DD")).toThrow(expectedError);
  });
});

describe("formatDate()", () => {
  const sampleDate = new Date(
    `2025-12-25T23:38:04-${timezoneConfig.offsetStandardTime}`,
  );

  type FormatDateTestCase = {
    format: Parameters<typeof formatDate>[1];
    expected: string;
  };

  test.each<FormatDateTestCase>([
    { format: "YYYY-MM-DD", expected: "2025-12-25" },
    { format: "ddd, MMM DD, YYYY", expected: "Thu, Dec 25, 2025" },
    { format: "dddd, MMMM D, YYYY", expected: "Thursday, December 25, 2025" },
    {
      format: "ISO8601",
      expected: `2025-12-25T23:38:04-${timezoneConfig.offsetStandardTime}`,
    },
  ])("should format to $format", ({ format, expected }) => {
    expect(formatDate(sampleDate, format)).toBe(expected);
  });
});

describe("addDays()", () => {
  test.each([
    {
      label: "first day of the month",
      start: "2025-01-01",
      days: 1,
      expected: "2025-01-02",
    },
    {
      label: "last day of the month",
      start: "2025-01-31",
      days: 1,
      expected: "2025-02-01",
    },
  ])(
    "should add $days day(s) to $label without mutating input",
    ({ start, days, expected }) => {
      const originalDate = parseDate(start, "YYYY-MM-DD");
      const result = addDays(originalDate, days);

      expect(formatDate(originalDate, "YYYY-MM-DD")).toBe(start);
      expect(formatDate(result, "YYYY-MM-DD")).toBe(expected);
    },
  );
});

describe("subtractDays()", () => {
  test.each([
    {
      label: "first day of the month",
      start: "2025-01-01",
      days: 1,
      expected: "2024-12-31",
    },
    {
      label: "last day of the month",
      start: "2025-01-31",
      days: 1,
      expected: "2025-01-30",
    },
  ])(
    "should subtract $days day(s) from $label without mutating input",
    ({ start, days, expected }) => {
      const originalDate = parseDate(start, "YYYY-MM-DD");
      const result = subtractDays(originalDate, days);

      expect(formatDate(originalDate, "YYYY-MM-DD")).toBe(start);
      expect(formatDate(result, "YYYY-MM-DD")).toBe(expected);
    },
  );
});

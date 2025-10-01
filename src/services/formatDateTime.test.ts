import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";

import { parseDate, formatDate } from "./formatDateTime";

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

const mockSystemTime = "2025-01-30 06:15:00";

beforeEach(() => {
  vi.setSystemTime(new Date(mockSystemTime));
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

  test("should format to MMMM DD, YYYY", () => {
    const formattedDate = formatDate(
      new Date("2025-12-25T23:38:04-06:00"),
      "MMMM DD, YYYY",
    );
    expect(formattedDate).toBe("December 25, 2025");
  });

  test("should format to ISO8601", () => {
    const formattedDate = formatDate(
      new Date("2025-12-25T23:38:04-06:00"),
      "ISO8601",
    );
    expect(formattedDate).toBe("2025-12-25T23:38:04-06:00");
  });
});

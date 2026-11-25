/**
Parses a date string into a Date object while preserving the current local time.

@param {string} value - Date string in YYYY-MM-DD format (e.g., "2025-12-25").
@param {"YYYY-MM-DD"} format - Expected date string format.
@returns {Date} Parsed Date object set to the specified calendar date and current local time.
@throws {Error} If the format is unsupported, the string does not match YYYY-MM-DD, or the calendar date is invalid (e.g., "2025-02-29").
*/

export function parseDate(value: string, format: "YYYY-MM-DD"): Date {
  if (format !== "YYYY-MM-DD") {
    throw new Error("Unsupported date format");
  }

  const YYYY_MM_DD_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

  const match = YYYY_MM_DD_REGEX.exec(value);
  if (!match) {
    throw new Error(
      `Invalid date string "${value}". Expected format: YYYY-MM-DD`,
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // preserve the local time
  const date = new Date();
  date.setFullYear(year, month - 1, day);

  // Prevent silent rollovers (e.g., 2025-02-29 -> 2025-03-01 or 2025-13-01 -> 2026-01-01)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid calendar date: "${value}"`);
  }

  return date;
}

/**
Formats a `Date` object into the specified string representation using local time.

Supported formats:
- `"YYYY-MM-DD"` — e.g., `"2025-12-25"`
- `"ddd, MMM DD, YYYY"` — e.g., `"Thu, Dec 25, 2025"`
- `"dddd, MMMM D, YYYY"` — e.g., `"Thursday, December 25, 2025"`
- `"ISO8601"` — e.g., `"2025-12-25T23:38:04-06:00"`

@param value - The `Date` object to format.
@param format - The target date format string.
@returns The formatted date string.
@throws {Error} If an unsupported date format is provided.

@example
formatDate(new Date(2025, 11, 25), "YYYY-MM-DD");
// => "2025-12-25"

@example
formatDate(new Date(2025, 11, 25), "ddd, MMM DD, YYYY");
// => "Thu, Dec 25, 2025"
*/
export function formatDate(
  value: Date,
  format: "YYYY-MM-DD" | "ddd, MMM DD, YYYY" | "dddd, MMMM D, YYYY" | "ISO8601",
): string {
  if (format === "YYYY-MM-DD") {
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const day = value.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (format === "ddd, MMM DD, YYYY") {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      weekday: "short",
    };

    return value.toLocaleDateString("en-US", options);
  }

  if (format === "dddd, MMMM D, YYYY") {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };

    return value.toLocaleDateString("en-US", options);
  }

  if (format === "ISO8601") {
    return formatDateToISOStringWithTimezone(value);
  }

  throw new Error("Unsupported date format");
}

function formatDateToISOStringWithTimezone(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const offsetSign = timezoneOffsetMinutes > 0 ? "-" : "+";
  const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60)
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(timezoneOffsetMinutes) % 60)
    .toString()
    .padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

export function getMonthName(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}

export function addDays(date: Date, numberOfDays: number) {
  const dateCopy = new Date(date);
  dateCopy.setDate(dateCopy.getDate() + numberOfDays);
  return dateCopy;
}

export function subtractDays(date: Date, numberOfDays: number) {
  const dateCopy = new Date(date);
  dateCopy.setDate(dateCopy.getDate() - numberOfDays);
  return dateCopy;
}

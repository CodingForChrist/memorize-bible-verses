export function parseDate(value: string, format: "YYYY-MM-DD"): Date {
  if (format !== "YYYY-MM-DD") {
    throw new Error("Unsupported date format");
  }

  const [year, month, day] = value.split("-").map(Number);

  // preserve the local time
  const date = new Date();
  date.setFullYear(year, month - 1, day);

  return date;
}

/**
 * Formats a Date object into one of the following formats:
 * - YYYY-MM-DD (2025-12-25)
 * - dddd, MMMM D, YYYY (Thursday, December 25, 2025)
 * - ISO8601 (2025-12-25T23:38:04-06:00)
 * @param {Date} value - Date object.
 * @param {("YYYY-MM-DD" | "dddd, MMMM D, YYYY" | "ISO8601" )} format - string format.
 * @returns {string} formatted date as a string.
 */
export function formatDate(
  value: Date,
  format: "YYYY-MM-DD" | "dddd, MMMM D, YYYY" | "ISO8601",
): string {
  if (format === "YYYY-MM-DD") {
    return formatDateToShortDateFormat(value);
  }

  if (format === "dddd, MMMM D, YYYY") {
    return formatDateToLongDateFormat(value);
  }

  if (format === "ISO8601") {
    return formatDateToISOStringWithTimezone(value);
  }

  throw new Error("Unsupported date format");
}

function formatDateToShortDateFormat(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateToLongDateFormat(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  return date.toLocaleDateString("en-US", options);
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

export function addDays(date: Date, numberOfDays: number): Date {
  const dateCopy = new Date(date);
  dateCopy.setDate(dateCopy.getDate() + numberOfDays);
  return dateCopy;
}

export function subtractDays(date: Date, numberOfDays: number): Date {
  const dateCopy = new Date(date);
  dateCopy.setDate(dateCopy.getDate() - numberOfDays);
  return dateCopy;
}

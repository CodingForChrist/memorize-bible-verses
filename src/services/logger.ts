export const LOG_LEVEL = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export type LogEntry = {
  time: number;
  level: LogLevel;
  message: string;
  payload?: Record<string, unknown>;
};

type LogOptions = Omit<LogEntry, "level" | "time">;

class Logger {
  logEntries: LogEntry[];

  constructor() {
    this.logEntries = [];
  }

  debug(logOptions: LogOptions) {
    this.#log({ ...logOptions, time: Date.now(), level: LOG_LEVEL.DEBUG });
  }

  info(logOptions: LogOptions) {
    this.#log({ ...logOptions, time: Date.now(), level: LOG_LEVEL.INFO });
  }

  warn(logOptions: LogOptions) {
    this.#log({ ...logOptions, time: Date.now(), level: LOG_LEVEL.WARN });
  }

  error(logOptions: LogOptions) {
    this.#log({ ...logOptions, time: Date.now(), level: LOG_LEVEL.ERROR });
  }

  #log(logEntry: LogEntry) {
    this.logEntries.push(logEntry);
    this.#sendCustomLogEvent(logEntry);

    const { level, message, payload } = logEntry;
    if (!console[level]) {
      throw new Error(
        `Invalid log level - Console API missing operation "${level}"`,
      );
    }
    console[level](message, payload);
  }

  #sendCustomLogEvent(logEntry: LogEntry) {
    const eventCustomLog = new CustomEvent<{
      logEntry: LogEntry;
    }>("custom-log", {
      detail: { logEntry },
      bubbles: true,
      composed: true,
    });
    globalThis.dispatchEvent(eventCustomLog);
  }
}

export const logger = new Logger();

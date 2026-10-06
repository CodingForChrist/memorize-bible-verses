import { CUSTOM_EVENT } from "../constants";

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
  logEntries: Map<string, LogEntry>;

  constructor() {
    this.logEntries = new Map<string, LogEntry>();
  }

  #log(logEntry: LogEntry) {
    const uuid = crypto.randomUUID();
    this.logEntries.set(uuid, logEntry);
    this.#sendCustomLogEvent(uuid, logEntry);

    const { level, message, payload } = logEntry;
    if (!Object.values(LOG_LEVEL).includes(level)) {
      throw new Error(
        `Invalid log level - Console API missing operation "${level}"`,
      );
    }
    console[level](message, payload);
  }

  #sendCustomLogEvent(uuid: string, logEntry: LogEntry) {
    const eventCustomLog = new CustomEvent<{
      uuid: string;
      logEntry: LogEntry;
    }>(CUSTOM_EVENT.LOG_ENTRY, {
      detail: { uuid, logEntry },
      bubbles: true,
      composed: true,
    });
    dispatchEvent(eventCustomLog);
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
}

export const logger = new Logger();

import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import type { LogEntry } from "../services/logger";

@customElement("console-logger")
export class ConsoleLogger extends LitElement {
  @state()
  logBuffer: LogEntry[] = [];

  static styles = css`
    :host {
      --debug-color: var(--color-lighter-gray);
      --debug-background-color: var(--color-gray);
      --debug-border-color: var(--color-light-gray);

      --info-color: #003e58;
      --info-background-color: #ccebf8;
      --info-border-color: #99d7f1;

      --warn-color: #60410c;
      --warn-background-color: #fcedd2;
      --warn-border-color: #f9daa5;

      --error-color: #651717;
      --error-background-color: #fed7d7;
      --error-border-color: #feb0b0;

      display: block;
      font-size: 0.875rem;
    }
    .log-entry {
      margin: 0.5rem 0;
      text-align: left;
    }
    .log-entry pre {
      margin: 0;
      font-size: 0.6rem;
    }
    .pill {
      font-size: 0.6rem;
      padding: 0.25rem;
      border-radius: 0.5rem;
    }
    .pill-debug {
      color: var(--debug-color);
      background-color: var(--debug-background-color);
      border-color: var(--debug-border-color);
    }
    .pill-info {
      color: var(--info-color);
      background-color: var(--info-background-color);
      border-color: var(--info-border-color);
    }
    .pill-warn {
      color: var(--warn-color);
      background-color: var(--warn-background-color);
      border-color: var(--warn-border-color);
    }
    .pill-error {
      color: var(--error-color);
      background-color: var(--error-background-color);
      border-color: var(--error-border-color);
    }
  `;

  constructor() {
    super();

    globalThis.addEventListener(
      "custom-log",
      (event: CustomEventInit<{ logEntry: LogEntry }>) => {
        const logEntry = event.detail?.logEntry;
        if (logEntry) {
          this.logBuffer = [...this.logBuffer, logEntry];
        }
      },
    );
  }

  render() {
    return html`
      <div>
        ${map(this.logBuffer, (logEntry) => this.#renderLogEntry(logEntry))}
      </div>
    `;
  }

  #renderLogEntry({ level, time, message, payload }: LogEntry) {
    return html`
      <div class="log-entry">
        <span>${this.#formatTime(time)}</span>
        <span class="pill pill-${level}">${level}</span>
        <span>${message}</span>
        <pre>${JSON.stringify(payload, undefined, 2)}</pre>
      </div>
    `;
  }

  #formatTime(time: number) {
    const dateObject = new Date(time);

    return dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  }
}

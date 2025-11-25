import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { query } from "lit/decorators/query.js";
import { state } from "lit/decorators/state.js";
import { styleMap } from "lit/directives/style-map.js";

import { CUSTOM_EVENT } from "../../constants";
import type { CustomEventUpdateRecitedBibleVerse } from "../../types";

@customElement("transcript-text")
export class TranscriptText extends LitElement {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ reflect: true })
  transcript: string = "";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @query("#transcript-textarea")
  transcriptTextareaElement?: HTMLTextAreaElement;

  @state()
  heightInPixels?: number;

  static styles = css`
    :host {
      display: block;
      margin: 2rem 0;
    }
    textarea {
      font: inherit;
      color: inherit;
      width: 100%;
      min-block-size: 10rem;
      padding: 1rem;
      background-color: var(--color-primary-mint-cream);
      border: 1px solid var(--color-light-gray);
      border-radius: 1.5rem;
      box-sizing: border-box;
      field-sizing: content;
      overflow: hidden;
      resize: none;
    }
    textarea:focus,
    textarea:active {
      border-color: var(--color-primary-mint-cream);
      outline: 1px solid var(--color-gray);
    }
    textarea:disabled {
      background-color: var(--color-lighter-gray);
      border-color: var(--color-light-gray);
      cursor: not-allowed;
    }
  `;

  render() {
    const placeholderText = `Speak or type in ${this.verseReference ?? "the verse reference"} from memory...`;

    this.#fieldSizingContentPolyfill();

    const dynamicStyles = {
      height: this.heightInPixels ? `${this.heightInPixels}px` : null,
    };

    return html`<textarea
      id="transcript-textarea"
      placeholder=${placeholderText}
      .value=${this.transcript}
      @input=${this.#fieldSizingContentPolyfill}
      @focusout=${this.#handleFocusout}
      ?disabled=${this.disabled}
      style=${styleMap(dynamicStyles)}
    ></textarea>`;
  }

  #fieldSizingContentPolyfill() {
    if (CSS.supports("field-sizing", "content")) {
      return;
    }

    if (!this.transcriptTextareaElement) {
      return;
    }

    const { clientHeight, scrollHeight } = this.transcriptTextareaElement;

    if (clientHeight < scrollHeight) {
      this.heightInPixels = scrollHeight;
    }
  }

  firstUpdated() {
    this.#fieldSizingContentPolyfill();
  }

  #handleFocusout(event: FocusEvent) {
    this.transcript = (event.target as HTMLTextAreaElement).value;
    this.#sendEventForRecitedBibleVerse(this.transcript);
  }

  #sendEventForRecitedBibleVerse(recitedBibleVerse: string) {
    const eventUpdateRecitedBibleVerse =
      new CustomEvent<CustomEventUpdateRecitedBibleVerse>(
        CUSTOM_EVENT.UPDATE_RECITED_BIBLE_VERSE,
        {
          detail: { recitedBibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    this.dispatchEvent(eventUpdateRecitedBibleVerse);
  }
}

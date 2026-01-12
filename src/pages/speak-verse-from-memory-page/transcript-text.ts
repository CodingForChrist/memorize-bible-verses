import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { formControlStyles } from "../../components/shared-styles";
import { CUSTOM_EVENT } from "../../constants";

@customElement("transcript-text")
export class TranscriptText extends LitElement {
  @property({ attribute: "verse-reference", reflect: true })
  verseReference?: string;

  @property({ reflect: true })
  transcript: string = "";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({
    attribute: "no-speech-recognition-support",
    type: Boolean,
    reflect: true,
  })
  noSpeechRecognitionSupport: boolean = false;

  textareaElementReference: Ref<HTMLTextAreaElement> = createRef();

  @state()
  heightInPixels?: number;

  static styles = [
    formControlStyles,
    css`
      :host {
        display: block;
        margin: 2rem 0;
      }
    `,
  ];

  get #placeholderText() {
    if (this.disabled) {
      return;
    }

    return `${this.noSpeechRecognitionSupport ? "Type" : "Speak or type"} in ${this.verseReference ?? "the verse reference"} from memory...`;
  }

  render() {
    this.#fieldSizingContentPolyfill();

    const dynamicStyles = {
      height: this.heightInPixels ? `${this.heightInPixels}px` : undefined,
    };

    return html`
      <textarea
        id="transcript-textarea"
        ${ref(this.textareaElementReference)}
        placeholder=${ifDefined(this.#placeholderText)}
        .value=${this.transcript}
        @input=${this.#fieldSizingContentPolyfill}
        @focusout=${this.#handleFocusout}
        ?disabled=${this.disabled}
        style=${styleMap(dynamicStyles)}
      ></textarea>
    `;
  }

  #fieldSizingContentPolyfill() {
    if (CSS.supports("field-sizing", "content")) {
      return;
    }

    if (!this.textareaElementReference.value) {
      return;
    }

    const { clientHeight, scrollHeight } = this.textareaElementReference.value;

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
    const eventUpdateRecitedBibleVerse = new CustomEvent<{
      recitedBibleVerse: string;
    }>(CUSTOM_EVENT.UPDATE_RECITED_BIBLE_VERSE, {
      detail: { recitedBibleVerse },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventUpdateRecitedBibleVerse);
  }
}

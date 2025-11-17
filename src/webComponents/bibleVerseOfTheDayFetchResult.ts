import scriptureStyles from "scripture-styles/dist/css/scripture-styles.css?inline";

import {
  removeExtraContentFromBibleVerse,
  standardizeBookNameInVerseReference,
} from "../services/formatApiResponse";
import { parseDate, formatDate } from "../services/dateTimeUtility";
import {
  LOADING_STATES,
  CUSTOM_EVENTS,
  MEMORIZE_BIBLE_VERSES_API_BASE_URL,
  type LoadingStates,
} from "../constants";

import type { BibleVerse, CustomEventUpdateBibleVerse } from "../types";

export class BibleVerseOfTheDayFetchResult extends HTMLElement {
  #selectedBibleVerse?: BibleVerse;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.#styleElement);
  }

  static get observedAttributes() {
    return ["loading-state", "bible-id", "is-visible", "date"];
  }

  get bibleId() {
    return this.getAttribute("bible-id");
  }

  get isVisible() {
    return this.getAttribute("is-visible") === "true";
  }

  get date() {
    const dateAttributeValue = this.getAttribute("date");
    if (dateAttributeValue) {
      return parseDate(dateAttributeValue, "YYYY-MM-DD");
    }
  }

  get #headingElement() {
    return this.shadowRoot!.querySelector("h2");
  }

  get #bibleVerseBlockquoteElement() {
    return this.shadowRoot!.querySelector("bible-verse-blockquote");
  }

  get #alertErrorElement() {
    return this.shadowRoot!.querySelector('alert-message[type="danger"]');
  }

  get selectedBibleVerse(): BibleVerse | undefined {
    return this.#selectedBibleVerse;
  }

  set selectedBibleVerse(value: BibleVerse) {
    this.#selectedBibleVerse = this.#formatBibleVerse(value);
    this.#sendEventForSelectedBibleVerse();
  }

  get loadingState() {
    return this.getAttribute("loading-state") as LoadingStates;
  }

  set loadingState(value: LoadingStates) {
    if (value === LOADING_STATES.PENDING) {
      this.#showLoadingSpinner();
    } else {
      this.#hideLoadingSpinner();
    }

    this.setAttribute("loading-state", value);
  }

  #sendEventForSelectedBibleVerse() {
    if (!this.selectedBibleVerse) {
      return;
    }
    const eventUpdateSelectedBible =
      new CustomEvent<CustomEventUpdateBibleVerse>(
        CUSTOM_EVENTS.UPDATE_BIBLE_VERSE,
        {
          detail: { bibleVerse: this.selectedBibleVerse },
          bubbles: true,
          composed: true,
        },
      );
    window.dispatchEvent(eventUpdateSelectedBible);
  }

  #showLoadingSpinner() {
    const loadingSpinnerElement = document.createElement("loading-spinner");
    this.shadowRoot!.appendChild(loadingSpinnerElement);
  }

  #hideLoadingSpinner() {
    this.shadowRoot!.querySelector("loading-spinner")?.remove();
  }

  #formatBibleVerse({
    id,
    bibleId,
    reference,
    content,
    verseCount,
  }: BibleVerse) {
    const options = {
      shouldRemoveSectionHeadings: true,
      shouldRemoveFootnotes: true,
      shouldRemoveVerseNumbers: verseCount < 2,
      shouldTrimParagraphBreaks: true,
    };

    return {
      id,
      bibleId,
      reference: standardizeBookNameInVerseReference(reference),
      content: removeExtraContentFromBibleVerse(content, options),
      verseCount,
    };
  }

  #removeResultElements() {
    this.#headingElement?.remove();
    this.#bibleVerseBlockquoteElement?.remove();
    this.#alertErrorElement?.remove();
  }

  #renderVerseOfTheDay() {
    this.#removeResultElements();

    const verseReferenceHeadingElement = document.createElement("h2");
    verseReferenceHeadingElement.textContent =
      this.selectedBibleVerse!.reference;
    this.shadowRoot!.appendChild(verseReferenceHeadingElement);

    const { bibleId, content } = this.selectedBibleVerse!;

    const bibleVerseBlockquoteElement = document.createElement(
      "bible-verse-blockquote",
    );

    bibleVerseBlockquoteElement.setAttribute("display-citation", "");
    bibleVerseBlockquoteElement.setAttribute("bible-id", bibleId ?? "");

    bibleVerseBlockquoteElement.innerHTML = `
      <span class="scripture-styles">
        ${content}
      </span>
    `;

    this.shadowRoot!.append(bibleVerseBlockquoteElement);
  }

  async #fetchVerseOfTheDay() {
    if (!this.bibleId || !this.date) {
      return;
    }

    const dateISOStringWithTimezoneOffset = formatDate(this.date, "ISO8601");

    try {
      this.loadingState = LOADING_STATES.PENDING;

      const response = await fetch(
        `${MEMORIZE_BIBLE_VERSES_API_BASE_URL}/api/v1/bibles/${this.bibleId}/verse-of-the-day`,
        {
          method: "POST",
          body: JSON.stringify({
            date: dateISOStringWithTimezoneOffset,
          }),
          headers: {
            "Content-Type": "application/json",
            "Application-User-Id": "memorize_bible_verses_web_app",
          },
        },
      );
      const json = await response.json();

      if (response.ok && json?.data?.content) {
        const { id, bibleId, content, verseCount } = json.data as BibleVerse;
        this.selectedBibleVerse = {
          id,
          bibleId,
          content,
          verseCount,
          reference: json.verseReference,
        };
        this.loadingState = LOADING_STATES.RESOLVED;
        // this.#renderTrackingPixel(json.meta.fumsToken);
      } else {
        throw new Error("Failed to find the verse");
      }
    } catch (_error) {
      this.loadingState = LOADING_STATES.REJECTED;
    }
  }

  #renderErrorMessage(message: string) {
    this.#removeResultElements();

    const alertMessageElement = document.createElement("alert-message");
    alertMessageElement.setAttribute("type", "danger");
    alertMessageElement.innerText = message;
    this.shadowRoot!.appendChild(alertMessageElement);
  }

  // TODO: figure out the correct way to use this
  // #renderTrackingPixel(fumsToken: string) {
  //   const imageElement = document.createElement("img");
  //   imageElement.width = 1;
  //   imageElement.height = 1;
  //   imageElement.style.width = "0";
  //   imageElement.style.height = "0";
  //   imageElement.src = `https://d3btgtzu3ctdwx.cloudfront.net/nf1?t=${fumsToken}`;

  //   this.shadowRoot!.appendChild(imageElement);
  // }

  get #styleElement() {
    const styleElement = document.createElement("style");
    const css = `
    :host {
      display: block;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 400;
      text-align: center;
    }
    bible-verse-blockquote,
    alert-message {
      margin-top: 3rem;
    }
    alert-message {
      margin-bottom: 2rem;
    }
    bible-verse-blockquote .scripture-styles {
      color: var(--color-gray);
    }
    ${scriptureStyles}
    `;
    styleElement.textContent = css;
    return styleElement;
  }

  async connectedCallback() {
    await this.#fetchVerseOfTheDay();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.loadingState === LOADING_STATES.PENDING) {
      // ignore changes while fetch call is pending
      return;
    }

    if (name === "is-visible" && newValue === "true") {
      if (this.selectedBibleVerse) {
        return this.#sendEventForSelectedBibleVerse();
      } else {
        return this.#fetchVerseOfTheDay();
      }
    }

    if (name === "loading-state") {
      if (newValue === LOADING_STATES.RESOLVED) {
        return this.#renderVerseOfTheDay();
      }
      if (newValue === LOADING_STATES.REJECTED) {
        return this.#renderErrorMessage("Failed to find the verse of the day");
      }
    }

    if (["bible-id", "date"].includes(name) && oldValue !== newValue) {
      this.#removeResultElements();
      if (this.isVisible) {
        return this.#fetchVerseOfTheDay();
      } else {
        this.loadingState = LOADING_STATES.INITIAL;
        this.#selectedBibleVerse = undefined;
      }
    }
  }
}

window.customElements.define(
  "bible-verse-of-the-day-fetch-result",
  BibleVerseOfTheDayFetchResult,
);

import { CUSTOM_EVENTS } from "../constants";

import type { CustomEventNavigateToStep } from "../types";

export class AccordionContainer extends HTMLElement {
  #openStep(stepNumber: number) {
    const detailsElement = this.querySelector<HTMLDetailsElement>(
      `details:nth-child(${stepNumber})`,
    );
    if (detailsElement) {
      detailsElement.open = true;
    }
  }

  #closeAllSteps() {
    this.querySelectorAll("details").forEach(
      (detailElement) => (detailElement.open = false),
    );
  }

  connectedCallback() {
    this.onclick = (event: Event) => {
      const eventTarget = event.target as HTMLElement;

      if (eventTarget.nodeName !== "SUMMARY") {
        return;
      }

      [...this.children].map((detail) => {
        detail.toggleAttribute("open", eventTarget == detail);
      });
    };

    window.addEventListener(
      CUSTOM_EVENTS.NAVIGATE_TO_STEP,
      (event: CustomEventInit<CustomEventNavigateToStep>) => {
        const stepNumber = event.detail?.stepNumber;
        if (stepNumber) {
          this.#closeAllSteps();
          this.#openStep(stepNumber);
        }
      },
    );
  }
}

window.customElements.define("accordion-container", AccordionContainer);

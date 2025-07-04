import { CUSTOM_EVENTS } from "../constants";

export class AccordionContainer extends HTMLElement {
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

    window.addEventListener(CUSTOM_EVENTS.NAVIGATE_TO_STEP, (event: Event) => {
      const customEvent = event as CustomEvent;
      const stepNumber = customEvent.detail.step;
      [...this.children].map((detail) => {
        detail.removeAttribute("open");
      });
      this.querySelector(`details:nth-child(${stepNumber})`)?.setAttribute(
        "open",
        "",
      );
    });
  }
}

window.customElements.define("accordion-container", AccordionContainer);

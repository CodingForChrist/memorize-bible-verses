export class AccordionContainer extends HTMLElement {
  connectedCallback() {
    // this.querySelectorAll<HTMLDetailsElement>()

    this.onclick = (event: Event) => {
      const eventTarget = event.target as HTMLElement;

      if (eventTarget.nodeName !== "SUMMARY") {
        return;
      }

      [...this.children].map((detail) => {
        detail.toggleAttribute("open", eventTarget == detail);
      });
    };
  }
}

window.customElements.define("accordion-container", AccordionContainer);

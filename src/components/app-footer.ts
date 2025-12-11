import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("app-footer")
export class AppFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    footer {
      margin-top: 10rem;
      text-align: center;
      color: var(--color-primary-mint-cream);
    }
    p {
      margin: 0 0 0.5rem 0;
    }
    a {
      color: var(--color-primary-mint-cream);
    }
    a:hover {
      color: var(--color-primary-mint-cream-darker-one);
    }
    a:focus {
      outline: 1px solid var(--color-primary-mint-cream-darker-one);
    }
    a:visited {
      color: var(--color-primary-mint-cream-darker-two);
    }
  `;
  version = import.meta.env.PACKAGE_VERSION;

  render() {
    return html`
      <footer>
        <p>© 2025 Memorize Bible Verses app</p>
        <p>
          <a
            href="https://github.com/CodingForChrist/memorize-bible-verses"
            target="_blank"
            rel="noopener noreferrer"
            >Contribute to the open source project on GitHub</a
          >
        </p>
        <p>version ${this.version}</p>
      </footer>
    `;
  }
}

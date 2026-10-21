import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("video-player")
export class VideoPlayer extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .video-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
    }
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  `;

  @property({ type: String, reflect: true })
  id = "";

  @property({ type: String, reflect: true })
  title = "YouTube video player";

  render() {
    if (!this.id) return html``;
    return html`
      <div class="video-container">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${this.id}"
          title="${this.title}"
          width="560"
          height="315"
          frameborder="0"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }
}

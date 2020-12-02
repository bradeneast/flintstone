import { html } from "../lit-html/lit-html";

export default ({
  title = '',
  action = null,
  content = '',
  className = '',
}) => html`<button title=${title} class=${className} @click=${action}>${content}</button>`;
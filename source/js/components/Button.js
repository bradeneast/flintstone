import { html } from "../lit-html/lit-html";

export default ({
  title = '',
  action = null,
  type = '',
  content = '',
  className = '',
  disabled = false,
}) =>
  html`<button type=${type} ?disabled=${disabled} title=${title} class=${className} @click=${action}>${content}</button>`;
import { html } from "../lit-html/lit-html";

export default ({
  title = '',
  action = null,
  content = '',
  className = '',
  disabled = false,
}) => html`<button ?disabled=${disabled} title=${title} class=${className} @click=${action}>${content}</button>`;
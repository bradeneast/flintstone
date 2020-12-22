import { html } from "lit-html";

export default ({
  title = '',
  action = null,
  icon = null,
  type = '',
  content = '',
  className = '',
  disabled = false,
}) =>
  html`
<button type=${type} ?disabled=${disabled} title=${title} ?data-has-icon=${icon} class=${className} @click=${action}>
  ${icon ? html`${icon} ${content}` : content}
</button>`;
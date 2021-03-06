import { svg } from "lit-html";

export default ({ content, className = 'line', color = '' }) => svg`
<svg class=${className} style=${color ? `--color:var(--${color})` : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216">
  ${content}
</svg>`;
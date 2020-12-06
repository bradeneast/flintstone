import { svg } from "../lit-html/lit-html";

export default ({ content, className = '' }) => svg`
<svg class=${className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216">
  ${content}
</svg>
`;
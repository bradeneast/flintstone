import renderPreview from "../functions/renderPreview";
import toggleDarkMode from "../functions/toggleDarkMode";
import { html } from "../lit-html/lit-html";
import state from "../state";

export default () => html`
<h1 id="logo">Contractly</h1>
<nav>
  <button title="Print the current document" class=icon @click=${() => { renderPreview(); window.print() }}>🖨️</button>
  <button title="Switch to ${state.dark ? 'light' : 'dark'} theme" class=icon @click=${toggleDarkMode}>
    ${state.dark ? "🌝" : "🌞"}
  </button>
</nav>
`
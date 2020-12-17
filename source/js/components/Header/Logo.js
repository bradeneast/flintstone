import { html } from "lit-html";

export default () => html`
<div id=logo>
  <light>
    <desktop-only>
      <img alt="Flintstone logo" src="logo.svg" />
    </desktop-only>
    <mobile-only>
      <img alt="Flintstone logo" src="logo-icon.svg" />
    </mobile-only>
  </light>
  <dark>
    <desktop-only>
      <img alt="Flintstone logo" src="logo-light.svg" />
    </desktop-only>
    <mobile-only>
      <img alt="Flintstone logo" src="logo-icon-light.svg" />
    </mobile-only>
  </dark>
</div>`
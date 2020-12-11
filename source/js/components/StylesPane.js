import { html, nothing } from "lit-html";
import state, { setState } from "../state";
import { tags } from "../style_data";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div ?data-active=${state.showStyles} class="styles">
  <div class=styles__header>
    <h2>Styles</h2>
    ${
      state.showPreview
      ? nothing
      : html`
      <span class=hint>
        Hint: <button class="link primary" @click=${() => setState('showPreview', true)}>Show the preview</button> to see your changes.
      </span>`
    }
  </div>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
import { html } from "lit-html";
import state from "../state";
import { tags } from "../style_data";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div ?data-active=${state.showStyles} class="styles">
  <h2>Styles</h2>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
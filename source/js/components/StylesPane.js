import { html } from "../lit-html/lit-html";
import state, { setState } from "../state";
import { tags } from "../style_data";
import { $ } from "../utils";
import Button from "./Button";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div ?data-active=${state.showStyles} class="styles">
  <h2>Styles</h2>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
import { html, svg } from "lit-html";
import toggleStyleEditor from "../../functions/toggleStyleEditor";
import state, { setState } from "../../state";
import { tags } from "../../style_data";
import Button from "../Button";
import Icon from "../Icon";
import Icons from "../Icons";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div class="styles">
  <div class=styles__header>
  ${
    state.showPreview
      ? html`
      <p class=light>
        Change the look and feel of your document here.
      </p>`
      : html`
      <p class=light>
        <button class="link primary" @click=${()=> setState('showPreview', true)}>Show the document preview</button> to see your
        changes.
      </p>`
  }
  <actions>
  ${
    Button({
      title: 'Close style editor',
      className: 'icon',
      icon: Icons.right,
      action: () => toggleStyleEditor(false)
    })
  }
  </actions>
  </div>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
import { html, svg } from "lit-html";
import toggleStyleEditor from "../../functions/toggleStyleEditor";
import state, { setState } from "../../state";
import { tags } from "../../style_data";
import Button from "../Button";
import Icon from "../Icon";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div class="styles">
  <div class=styles__header>
  ${
    state.showPreview
      ? html`
      <p class=hint>
        Change the look and feel of your document here.
      </p>`
      : html`
      <p class=hint>
        <button class="link primary" @click=${()=> setState('showPreview', true)}>Show the document preview</button> to see your
        changes.
      </p>`
  }
  <actions>
  ${
    Button({
      title: 'Close style editor',
      className: 'icon',
      content: Icon({
        content: svg`<path d="M73.67,26.62,155.05,108,73.67,189.38" />`,
        className: 'line'
      }),
      action: () => toggleStyleEditor(false)
    })
  }
  </actions>
  </div>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
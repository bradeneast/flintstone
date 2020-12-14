import { html, svg } from "lit-html";
import toggleStyleEditor from "../functions/toggleStyleEditor";
import state, { setState } from "../state";
import { tags } from "../style_data";
import Button from "./Button";
import Icon from "./Icon";
import StyleAdjustment from "./StyleAdjustment";


export default () => html`
<div class="styles mount-children">
  <div class=styles__header>
  ${
    state.showPreview
      ? html`
      <span class=hint>
        Use these adjustments to change the look and feel of your document.
      </span>`
      : html`
      <span class=hint>
        <button class="link primary" @click=${()=> setState('showPreview', true)}>Show the preview</button> to see your
        changes.
      </span>`
  }
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
  </div>
  <div class=adjustments>
    ${Object.entries(tags).map(StyleAdjustment)}
  </div>
</div>`;
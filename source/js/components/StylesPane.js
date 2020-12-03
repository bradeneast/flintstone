import { html } from "../lit-html/lit-html";
import state, { setState } from "../state";
import { properties, tags } from "../style_data";
import Button from "./Button";
import {range, select, text} from "./StyleAdjustment";

export default () => html`
<div ?data-active=${state.showStyles} class="styles">
  <h2>Styles</h2>
  ${
    Button({
      title: `${state.showStyles ? 'Close' : 'Open'} style editor`,
      content: '✨',
      className: 'icon style-editor-toggle',
      action: () => setState('showStyles', !state.showStyles)
    })
  }
  <div class=adjustments>
  ${Object.entries(tags).map(tag => html`
    <div class=adjustment>
      <h3>${tag[1]}</h3>
      ${properties.map(prop => {
        switch (prop.type) {
          case 'range': return range(tag, prop);
          case 'text': return text(tag, prop);
          case 'select': return select(tag, prop);
        }
      })}
    </div>
  `)}
  </div>
</div>`;
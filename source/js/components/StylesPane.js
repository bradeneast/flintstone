import { html } from "../lit-html/lit-html";
import state, { setState } from "../state";
import { adjustments, tags } from "../style_data";
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
  ${Object.entries(tags).map(([tagName, {normieName, useAdjustments}]) => html`
    <div class=adjustment>
      <h3>${normieName}</h3>
      ${Object.entries(adjustments).map(([propName, propData]) => {

        if (!useAdjustments.includes(propName)) return;
        let tagArgument = [tagName, { normieName, useAdjustments }];
        let propArgument = [propName, propData];
        
        switch (propData.type) {
          case 'range': return range(tagArgument, propArgument);
          case 'text': return text(tagArgument, propArgument);
          case 'select': return select(tagArgument, propArgument);
        }
      })}
    </div>
  `)}
  </div>
</div>`;
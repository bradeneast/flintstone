import { html, nothing } from "lit-html";
import { adjustments } from "../style_data";
import state from "../state";
import { $ } from "../utils";
import Button from "./Button";
import { range, select, text } from "./StyleAdjustmentInput";
import highlightElements from "../functions/highlightElements";
import resetAdjustmentStyles from "../functions/resetAdjustmentStyles";
import toggleExpanded from "../functions/toggleExpanded";


export default ([tagName, { normieName, useAdjustments }]) => {
  
  let isExpanded = state.expandedAdjustments.includes(normieName);

  return html`
  <div 
  class=adjustment 
  ?data-expanded=${isExpanded}
  @mouseenter=${() => highlightElements(tagName)} 
  @touchstart=${() => highlightElements(tagName)}
  @mouseleave=${() => $('#temp')?.remove()}
  @touchend=${() => $('#temp')?.remove()}>

    <button class=adjustment__header @click=${() => toggleExpanded(normieName)}>
      <h3 class=adjustment__header--title>${normieName}</h3>
      <div class=adjustment__header--actions>
      ${
        Button({
          title: `Reset ${normieName.replace(/s$/, '')} styles`,
          className: 'icon',
          disabled: !isExpanded,
          content: '↩',
          action: () => resetAdjustmentStyles(tagName),
        })
      }
      </div>
    </button>
    
    ${
      isExpanded
        ? Object.entries(adjustments).map(([propName, propData]) => {
            // Skip properties not included for this adjustment module
            if (!useAdjustments.includes(propName)) return;

            let tagArgument = [tagName, { normieName, useAdjustments }];
            let propArgument = [propName, propData];  

            // Return the correct type of input component
            switch (propData.type) {
              case 'range': return range(tagArgument, propArgument);
              case 'text': return text(tagArgument, propArgument);
              case 'select': return select(tagArgument, propArgument);
            }
          })
        : nothing
    }
  </div>`;
}
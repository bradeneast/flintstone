import setPreviewStyle from "../../functions/setPreviewStyle";
import { html } from "lit-html";
import state from "../../state";

let cleanPropName = string => string.replace(/-+/g, ' ').trim();
let cleanPropValue = string => parseFloat(string.replace(/turn|deg|pt|px|rem|em|ch|in|vw|vh|%/g, '').trim());


/**Returns a lit-html label and range input */
export let range = ([tagName, { normieName }], [propName, { min, max, step, unit }]) => {

  let unitValue = state.currentUser.styles[tagName][propName] || '';
  let cleanedValue = cleanPropValue(unitValue);
  let cleanedName = cleanPropName(propName);

  return html`
  <label>
    <span class=label>
      <span class=label__name>${cleanedName}</span>
      <span class=label__value>${unitValue || ''}</span>
    </span>
    <input 
    title='Change ${normieName} ${cleanedName}'
    min=${min}
    max=${max}
    step=${step}
    .value=${cleanedValue}
    type=range
    @input=${event => 
      setPreviewStyle(
        tagName, 
        propName, 
        event.target.value + unit
      )
    } />
  </label>`;
}


/**Returns a lit-html label and text input */
export let text = ([tagName, { normieName }], [propName, { placeholder }]) => {

  let unitValue = state.currentUser.styles[tagName][propName];
  let cleanedName = cleanPropName(propName);

  return html`
  <label>
    <span class=label>
      <span class=label__name>${cleanedName}</span>
    </span>
    <input
    title='Change ${normieName} ${cleanedName}'
    placeholder=${placeholder}
    .value=${unitValue || ''}
    type=text
    @input=${event=> 
      setPreviewStyle(
        tagName, 
        propName, 
        event.target.value
      )
    } />
  </label>`;
}


/**Returns a lit-html label and select input */
export let select = ([tagName, { normieName }], [propName, { options, defaultValue }]) => {

  let unitValue = state.currentUser.styles[tagName][propName] || defaultValue;
  let cleanedName = cleanPropName(propName);

  return html`
  <label>
    <span class=label>
      <span class=label__name>${cleanedName}</span>
    </span>
    <select
    title='Change ${normieName} ${cleanedName}'
    .value=${unitValue || '' }
    @input=${event=> 
      setPreviewStyle(
        tagName, 
        propName, 
        event.target.value
      )
    }>
      ${options.map(opt => 
        html`<option ?selected=${opt==unitValue}>${opt}</option>`
      )}
    </select>
  </label>`;
}
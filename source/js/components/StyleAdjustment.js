import setPreviewStyle from "../functions/setPreviewStyle";
import { html } from "../lit-html/lit-html";
import state from "../state";


/**Returns a lit-html label and range input */
export let range = ([tagName, { normieName }], [propName, { min, max, step, unit }]) => {

  let unitValue = state.styles[tagName][propName];

  return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, ' ')}</span>
      <span class=label__value>${unitValue || ''}</span>
    </span>
    <input value=${parseFloat(unitValue)} title='${normieName} ${propName}' min=${min} max=${max} step=${step} type=range
      @input=${event =>
      setPreviewStyle(tagName, propName, event.target.value + unit)} />
  </label>`;
}


/**Returns a lit-html label and text input */
export let text = ([tagName, { normieName }], [propName, { placeholder }]) => {

  let unitValue = state.styles[tagName][propName];

  return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, ' ')}</span>
    </span>
    <input placeholder=${placeholder} value=${unitValue || '' } title='${normieName} ${propName}' type=text
      @input=${event=>
      setPreviewStyle(tagName, propName, event.target.value)} />
  </label>`;
}


/**Returns a lit-html label and select input */
export let select = ([tagName, { normieName }], [propName, { options, defaultValue }]) => {

  let unitValue = state.styles[tagName][propName] || defaultValue;

  return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, ' ')}</span>
    </span>
    <select title='${normieName} ${propName}' value=${unitValue || '' } @input=${event=>
        setPreviewStyle(tagName, propName, event.target.value)}>
      ${options.map(opt => html`<option ?selected=${opt==unitValue}>${opt}</option>`)}
    </select>
  </label>`;
}
import setPreviewStyle from "../functions/setPreviewStyle";
import { html } from "../lit-html/lit-html";
import state from "../state";


export let range = ([tagName, normieName], [propName, { min, max, step, unit }]) => {

  let unitValue = state.styles[tagName][propName];

  return html`
  <label>
    ${propName.replace(/-/g, ' ')} ${unitValue ? `(${unitValue})` : ''}
    <input value=${parseFloat(unitValue)} title='${normieName} ${propName}' min=${min} max=${max} step=${step} type=range
      @input=${event =>
      setPreviewStyle(tagName, propName, event.target.value + unit)} />
  </label>`;
}


export let text = ([tagName, normieName], [propName, { placeholder }]) => {

  let unitValue = state.styles[tagName][propName];

  return html`
  <label>
    ${propName.replace(/-/g, ' ')}
    <input placeholder=${placeholder} value=${unitValue || '' } title='${normieName} ${propName}' type=text
      @input=${event=>
      setPreviewStyle(tagName, propName, event.target.value)} />
  </label>`;
}


export let select = ([tagName, normieName], [propName, { options, defaultValue }]) => {

  let unitValue = state.styles[tagName][propName] || defaultValue;

  return html`
  <label>
    ${propName.replace(/-/g, ' ')}
    <select title='${normieName} ${propName}' value=${unitValue || '' } @input=${event=>
        setPreviewStyle(tagName, propName, event.target.value)}>
      ${options.map(opt => html`<option ?selected=${opt==unitValue}>${opt}</option>`)}
    </select>
  </label>`;
}
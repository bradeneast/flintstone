import setPreviewStyle from "../functions/setPreviewStyle";
import { html } from "../lit-html/lit-html";
import state from "../state";

export let range = ([tagName, normieName], { name, min, max, step, unit }) => {

  let unitValue = state.styles[tagName][name];

  return html`
  <label>
    ${name.replace(/-/g, ' ')} ${unitValue ? `(${unitValue})` : ''}
    <input value=${parseFloat(unitValue)} title='${normieName} ${name}' min=${min} max=${max} step=${step} type=range
      @input=${event=>
    setPreviewStyle(tagName, name, event.target.value + unit)} />
  </label>`;
}

export let text = ([tagName, normieName], { name, placeholder = '' }) => {

  let unitValue = state.styles[tagName][name];

  return html`
  <label>
    ${name.replace(/-/g, ' ')}
    <input placeholder=${placeholder} value=${unitValue || ''} title='${normieName} ${name}' type=text @input=${event =>
      setPreviewStyle(tagName, name, event.target.value)} />
  </label>`;
}

export let select = ([tagName, normieName], { name, options = [], defaultValue }) => {

  let unitValue = state.styles[tagName][name] || defaultValue;

  return html`
  <label>
    ${name.replace(/-/g, ' ')}
    <select title='${normieName} ${name}' value=${unitValue || ''} @input=${event =>
        setPreviewStyle(tagName, name, event.target.value)}>
      ${options.map(opt => html`<option ?selected=${opt == unitValue}>${opt}</option>`)}
    </select>
  </label>`;
}
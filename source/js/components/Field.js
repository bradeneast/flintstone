import { html } from "../lit-html/lit-html";
import removeField from "../functions/removeField";
import renameField from '../functions/renameField';
import updateFieldValue from '../functions/updateFieldValue';

export default ([key, value], index, datasetID) => {

  let keyID = `${index}_${datasetID}_key`;
  let valueID = `${index}_${datasetID}_value`;

  return html`
  <li>
    <key>
      <input @input=${event=> renameField(index, event.target.value, datasetID)} .value=${key} type=text id=${keyID} />
    </key>
    <value>
      <input @input=${event=> updateFieldValue(index, event.target.value, datasetID)} .value=${value} type=text
      id=${valueID} />
    </value>
    <button class=icon title="Delete Field" @click=${removeField.bind(this, index, datasetID)}>🗑️</button>
  </li>
`;
}
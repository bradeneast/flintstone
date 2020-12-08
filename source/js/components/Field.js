import { html, svg } from "lit-html";
import removeField from "../functions/removeField";
import renameField from '../functions/renameField';
import updateFieldValue from '../functions/updateFieldValue';
import Button from "./Button";
import moveField from "../functions/moveField";
import Icon from "./Icon";
import state from "../state";

export default ([key, value], fieldIndex, datasetIndex) => {

  let keyID = `${datasetIndex}_${fieldIndex}_key`;
  let valueID = `${datasetIndex}_${fieldIndex}_value`;

  return html`
  <li data-index=${fieldIndex}>
    <key>
      <input @input=${event => renameField(fieldIndex, event.target.value)} .value=${key} type=text id=${keyID} />
    </key>
    <value>
      <input @input=${event => updateFieldValue(fieldIndex, event.target.value)} .value=${value} type=text
      id=${valueID} />
    </value>
    <actions>
      <div class=join-buttons>
        ${
          Button({
            title: 'Move field up',
            className: 'icon',
            disabled: fieldIndex == 0,
            content: Icon({
              content: svg`<polyline points="184.69 146.81 108 70.12 31.31 146.81" />`, 
              className: 'line'
            }),
            action: () => moveField(fieldIndex, -1)
          })
        }
        ${
          Button({
            title: 'Move field down',
            className: 'icon',
            disabled: fieldIndex == state.currentDataset.fields.length - 1,
            content: Icon({
              content: svg`<polyline points="184.69 70.12 108 146.81 31.31 70.12" />`, 
              className: 'line'
            }),
            action: () => moveField(fieldIndex, 1)
          })
        }
      </div>
      ${
        Button({
          title: 'Delete field',
          className: 'icon',
          content: '🗑️',
          action: () => removeField(fieldIndex)
        })
      }
    </actions>
  </li>
  `;
}
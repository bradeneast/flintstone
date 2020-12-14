import { html, svg } from "lit-html";
import removeField from "../functions/removeField";
import renameField from '../functions/renameField';
import updateFieldValue from '../functions/updateFieldValue';
import Button from "./Button";
import moveField from "../functions/moveField";
import Icon from "./Icon";
import state from "../state";
import { $ } from "../utils";


/**Selects a custom data field by its index */
export let selectFieldByIndex = index => $(`.fields [data-index="${index}"]`);


export default ([key, value], fieldIndex, datasetIndex) => {

  let keyID = `${datasetIndex}_${fieldIndex}_key`;
  let valueID = `${datasetIndex}_${fieldIndex}_value`;

  return html`
  <li data-index=${fieldIndex}>
    <key>
      <input 
      title="Rename this field"
      type=text
      .value=${key} 
      id=${keyID}
      @input=${event => 
        renameField(fieldIndex, event.target.value)
      } />
    </key>
    <value>
      <input 
      title="Change the value this field"
      type=text
      .value=${value} 
      id=${valueID}
      @input=${event => 
        updateFieldValue(fieldIndex, event.target.value)
      } />
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
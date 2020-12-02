import { html } from "../lit-html/lit-html";
import removeField from "../functions/removeField";
import renameField from '../functions/renameField';
import updateFieldValue from '../functions/updateFieldValue';
import Button from "./Button";
import moveField from "../functions/moveField";

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
            content: '⬆️',
            action: () => moveField(fieldIndex, -1)
          })
        }
        ${
          Button({
            title: 'Move field down',
            className: 'icon',
            content: '⬇️',
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
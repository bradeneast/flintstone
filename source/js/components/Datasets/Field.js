import { html, svg } from "lit-html";
import removeField from "../../functions/removeField";
import renameField from '../../functions/renameField';
import updateFieldValue from '../../functions/updateFieldValue';
import Button from "../Button";
import moveField from "../../functions/moveField";
import Icon from "../Icon";
import state from "../../state";
import Icons from "../Icons";


export default ([key, value], fieldIndex, datasetIndex) => {

  let keyID = `${datasetIndex}_${fieldIndex}_key`;
  let valueID = `${datasetIndex}_${fieldIndex}_value`;

  return html`
  <li class=field data-index=${fieldIndex}>
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
            icon: Icons.up,
            action: () => moveField(fieldIndex, -1)
          })
        }
        ${
          Button({
            title: 'Move field down',
            className: 'icon',
            disabled: fieldIndex == state.currentDataset.fields.length - 1,
            icon: Icons.down,
            action: () => moveField(fieldIndex, 1)
          })
        }
      </div>
      ${
        Button({
          title: 'Delete field',
          className: 'icon',
          icon: Icons.delete,
          action: () => removeField(fieldIndex)
        })
      }
    </actions>
  </li>`;
}
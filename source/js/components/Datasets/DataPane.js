import addDataset from "../../functions/addDataset";
import addField from "../../functions/addField";
import duplicateDataset from "../../functions/duplicateDataset";
import removeDataset from "../../functions/removeDataset";
import renameDataset from "../../functions/renameDataset";
import setCurrentDataset from "../../functions/setCurrentDataset";
import { html, nothing } from "lit-html";
import state from "../../state";
import Button from "../Button";
import Field from "./Field";
import toggleStyleEditor from "../../functions/toggleStyleEditor";


export default () => {

  let current = state.currentDataset;

  return html`
  <div @click=${() => toggleStyleEditor(false)} class="pane data">
    <label class="smol light" for="currentDatasetTitle">Current data</label>
    ${
    current
      ? html`
      <div class="selection mount">

        <div class="selection__header">
          <h2 data-active=true>
            <input 
            id=currentDatasetTitle
            title="Rename the current data set"
            type=text 
            .value=${current.id} 
            @input=${event => renameDataset(event.target.value)} />
          </h2>
        </div>

        <ul class="fields">
        ${
          current.fields.length
            ? html`
            <li>
              <label class="smol light">Name</label>
              <label class="smol light">Value</label>
              <span></span>
            </li>`
            : nothing
        }
        ${current.fields.map((field, index) => Field(field, index, current.id))}
        ${
          Button({
            action: addField,
            className: 'link',
            content: '+ Add Field'
          })
        }
        </ul>

      </div>`
      : nothing
    }

    <label class="smol light">All data</label>
    <ul class="sets mount">
      ${state.currentUser.datasets.map((dataset, datasetIndex) => html`
      <li data-index=${datasetIndex}>
        ${
          Button({
            title: `Select ${dataset.id}`,
            className: 'link',
            action: () => setCurrentDataset(datasetIndex),
            content: html`<h4>${dataset.id}</h4>`
          })
        }
        ${
          Button({
            title: `Duplicate ${dataset.id}`,
            className: 'icon',
            action: () => duplicateDataset(datasetIndex),
            content: '📄'
          })
        }
        ${
          state.currentUser.datasets.length > 1
            ? Button({
              title: `Delete ${dataset.id}`,
              className: 'icon',
              action: () => removeDataset(datasetIndex),
              content: '🗑️'
            })
            : nothing
        }
      </li>`)
      }
      <button @click=${addDataset}>Add Data</button>
    </ul>
  </div>`;
}
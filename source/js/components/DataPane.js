import addDataset from "../functions/addDataset";
import addField from "../functions/addField";
import duplicateDataset from "../functions/duplicateDataset";
import removeDataset from "../functions/removeDataset";
import renameDataset from "../functions/renameDataset";
import setCurrentDataset from "../functions/setCurrentDataset";
import { html, nothing } from "lit-html";
import state from "../state";
import Button from "./Button";
import Field from "./Field";
import toggleStyleEditor from "../functions/toggleStyleEditor";


export default () => html`
<div @click=${() => toggleStyleEditor(false)} class="pane data">
  <label for="currentDatasetTitle">Current data</label>
  ${
    state.currentDataset
    ? html`
    <div class="selection">

      <h2 data-active=true>
        <input 
        id=currentDatasetTitle
        title="Rename the current data set"
        type=text 
        .value=${state.currentDataset.id} 
        @input=${event => 
          renameDataset(event.target.value)
        } />
      </h2>

      <ul class="fields">
      ${
        state.currentDataset.fields.length
          ? html`
          <li>
            <label>Name</label>
            <label>Value</label>
            <span></span>
          </li>`
          : nothing
      }
      ${
        state.currentDataset.fields
          .map((field, index) => Field(field, index, state.currentDataset.id))
      }
        <button @click=${addField}>Add Field</button>
      </ul>

    </div>`
    : nothing
  }

  <label>All data</label>
  <ul class="sets">
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
    </li>
    `)
    }
    <button @click=${addDataset}>Add Data</button>
  </ul>
</div>
`
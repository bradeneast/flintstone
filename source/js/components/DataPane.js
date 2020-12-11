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


export default () => html`
<div class="pane data">
  <h2>Data</h2>
  ${
    state.currentDataset
    ? html`
    <div class="selection mount-children">

      <h3 data-active=true>
        <input type=text .value=${state.currentDataset.id} @input=${event=> renameDataset(event.target.value)} />
      </h3>

      <ul class="fields mount-children">
        <li>
          <label>Name</label>
          <label>Value</label>
          <span></span>
        </li>
        ${state.currentDataset.fields.map((field, index) =>
        Field(field, index, state.currentDataset.id)
        )
        }
        <button @click=${addField}>Add Field</button>
      </ul>

    </div>`
    : nothing
  }

  <ul class="sets mount-children">
    ${state.currentUser.datasets.map((dataset, datasetIndex) => html`
    <li>
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
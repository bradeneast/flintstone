import addDataset from "../functions/addDataset";
import addField from "../functions/addField";
import duplicateDataset from "../functions/duplicateDataset";
import removeDataset from "../functions/removeDataset";
import renameDataset from "../functions/renameDataset";
import setCurrentDataset from "../functions/setCurrentDataset";
import { html, nothing } from "../lit-html/lit-html";
import state from "../state";
import Field from "./Field";

export default () => html`
<h2>Data</h2>
${
  state.currentDataset
    ? html`
    <div>
      <h3 data-active=true>
        <input type=text .value=${state.currentDataset.id} @input=${event => renameDataset(event.target.value)} />
      </h3>
      <ul class=fields>
        <li>
          <label>Name</label>
          <label>Value</label>
          <span></span>
        </li>
        ${state.currentDataset.fields.map((field, index) =>
        Field(field, index, state.currentDataset.id)
        )}
        <button @click=${addField}>Add Field</button>
      </ul>
    </div>
    `
    : nothing
}
<ul class=sets>
  ${state.currentUser.datasets.map((dataset, datasetIndex) => html`
  <li>
    <button class=link @click=${() => setCurrentDataset(datasetIndex)}>
      <h4>${dataset.id}</h4>
    </button>
    <button title="Duplicate ${dataset.id}" class=icon @click=${()=> duplicateDataset(datasetIndex)}>📄</button>
    <button title="Delete ${dataset.id}" class=icon @click=${() => removeDataset(datasetIndex)}>🗑️</button>
  </li>
  `)}
  <button @click=${addDataset}>Add Data</button>
</ul>
`
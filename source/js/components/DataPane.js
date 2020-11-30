import setCurrentDataset from "../functions/setCurrentDataset";
import { html } from "../lit-html/lit-html";
import state from "../state";

export default () => html`
<h2>Data</h2>
<ul class=sets>
  ${state.currentUser.datasets.map(dataset => html`
  <li ?data-active=${state.currentDataset?.id==dataset.id} data-dataset-id=${dataset.id}>
  <button class=link @click=${setCurrentDataset}>
    ${dataset.id}
  </button>
  <ul class=fields>
    ${
      Object
        .entries(dataset.fields)
        .map((key, value) => {
          return html`
          <li>
            <key>
              <label for='${key}_key'>Name</label>
              <input .value=${key} @input=${dataset.fields} type=text id='${key}_key' />
            </key>
            <value>
              <label for='${key}_value'>Value</label>
              <input .value=${value} type=text id='${key}_value' />
            </value>
          </li>
        `
      })
    }
  </ul>
  </li>
  `)}
</ul>
`
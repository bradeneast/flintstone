import { html, nothing } from "lit-html";
import ExportCheckbox from "./ExportCheckbox";
import ImportCheckbox from "./ImportCheckbox";


export default (data, key, type) => html`
<div style="width: 100%">
  ${
    data[key] && Object.keys(data[key])?.length
      ? html`
      <label style="margin-bottom: .5rem;">${key}</label>
      ${data[key].map((item, index) => {
        if (type == 'import')
          return ImportCheckbox(item, index, key)
        if (type == 'export')
          return ExportCheckbox(item, index, key)
      })}`
      : nothing
  }
</div>`
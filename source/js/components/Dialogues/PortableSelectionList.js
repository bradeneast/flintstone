import { html, nothing } from "lit-html";
import ExportCheckbox from "./ExportCheckbox";
import ImportCheckbox from "./ImportCheckbox";


export default (data, key, type) => html`
<div style="width: 100%">
${
  Object.keys(data[key])?.length
    ? html`
    <label style="margin: .5rem 0;">${key}</label>
      ${data[key].map((item, index) => {
        if (type == 'import')
          return ImportCheckbox(item, index, key)
        if (type == 'export')
          return ExportCheckbox(item, index, key)
      })
    }`
    : nothing
}
</div>`
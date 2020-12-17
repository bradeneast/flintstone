import { html } from "lit-html";
import { portables } from "../../config";
import state, { renderAll } from "../../state";
import { createDownload } from "../../utils";
import Button from "../Button";
import ExportCheckbox from "./ExportCheckbox";

export default () => html`
<form class=mount>
  ${
    portables.map(key => html`
    <div style="width: 100%">
      <label style="margin: .5rem 0;">${key}</label>
      ${state.currentUser[key].map((item, index) => ExportCheckbox(item, index, key))}
    </div>`)
  }
  <a 
  ?disabled=${!portables.some(key => state.forExport[key].length)} 
  class="button primary" 
  href=${createDownload(state.forExport)} 
  download="Flintstone Export (${new Date().toLocaleDateString()})">
    Export Selected
  </a>
  ${
    Button({
      className: 'link',
      content: 'Back to editing',
      action: () => renderAll()
    })
  }
</form>`;
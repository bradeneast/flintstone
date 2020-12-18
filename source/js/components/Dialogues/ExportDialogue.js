import { html } from "lit-html";
import { portables } from "../../config";
import state, { renderAll } from "../../state";
import { createDownload } from "../../utils";
import Button from "../Button";
import PortableSelectionList from "./PortableSelectionList";

export default () => html`
<form class=mount>
  ${portables.map(key => 
    PortableSelectionList(state.currentUser, key, 'export')
  )}
  <a class="button primary" 
  ?disabled=${!portables.some(key => state.exportSelection[key]?.length)} 
  href=${createDownload(state.exportSelection)} 
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
import { html } from "lit-html";
import { portables } from "../../config";
import handleImport from "../../functions/handleImport";
import state, { renderAll, setState } from "../../state";
import Button from "../Button";
import PortableSelectionList from "./PortableSelectionList";


export default () => html`
<input 
type=file 
accept=".json"
@input=${handleImport}
@drop=${handleImport} />
${Object.keys(state.forImport).length
  ? html`
  <form class=mount>
    ${portables.map(key => 
      PortableSelectionList(state.forImport, key, 'import')
    )}
    ${
      Button({
        className: 'primary',
        content: 'Import Selected',
        disabled: !portables.some(key => state.importSelection[key]?.length),
        action: () => {
          for (let key of portables)
            state.currentUser[key] = state.currentUser[key].concat(state.importSelection[key]);
          setState('forImport', {});
        }
      })
    }
    ${
      Button({
        className: 'link',
        content: 'Back to editing',
        action: () => renderAll()
      })
    }
  </form>`
  : html`<h3>Click or drop a file to import it.</h3>`
}`;
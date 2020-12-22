import { html } from "lit-html";
import { portables } from "../../config";
import handleImport from "../../functions/handleImport";
import state, { renderAll, setState } from "../../state";
import Button from "../Button";
import PortableSelectionList from "./PortableSelectionList";


export default () => Object.keys(state.forImport).length
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
  : html`
  <input class=mount type=file accept=".json" @input=${handleImport} @dragleave=${event => { event.preventDefault(); renderAll() }} @drop=${handleImport} />
  <div class=mount style="pointer-events: none;">
    <h3>Click or drop a file to import it.</h3>
    ${Button({ className: 'link', content: 'Cancel Import', action: () => renderAll() })}
  </div>`;
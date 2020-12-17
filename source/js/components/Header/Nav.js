import toggleStyleEditor from "../../functions/toggleStyleEditor";
import printDocument from "../../functions/printDocument";
import state, { preferences, renderAll, setPreference } from "../../state";
import Button from '../Button';
import { html } from "lit-html";
import Modal from "../Modal";
import ExportDialogue from "../Dialogues/ExportDialogue";
import { portables } from "../../config";
import toggleMenu from "../../functions/toggleMenu";


export default () => html`
<nav>
${
  Button({
    className: 'icon',
    content: `✨ ${ preferences.showStyles ? 'Close' : 'Open' } style editor`,
    action: () => {
      toggleMenu(false);
      toggleStyleEditor();
    }
  })
}
${
  Button({
    className: 'icon',
    content: '🖨️ Print current document',
    action: printDocument
  })
}
${
  Button({
    className: 'icon',
    content: '🚚 Start an export',
    action: () => {
      state.forExport = {};
      portables.map(key => state.forExport[key] = []);
      renderAll(Modal(ExportDialogue()))
    }
  })
}
${
  Button({
    className: 'icon',
    content: html`<light>🌞</light><dark>🌝</dark> Switch to <light>dark</light><dark>light</dark> theme`,
    action: () => setPreference('dark', !preferences.dark)
  })
}
</nav>`;
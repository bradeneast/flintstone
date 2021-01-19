import printDocument from "../../functions/printDocument";
import state, { preferences, renderAll, setPreference } from "../../state";
import Button from '../Button';
import { html } from "lit-html";
import Modal from "../Modal";
import ExportDialogue from "../Dialogues/ExportDialogue";
import { portables } from "../../config";
import toggleMenu from "../../functions/toggleMenu";
import ImportDialogue from "../Dialogues/ImportDialogue";
import Icons from "../Icons";
import KeyboardShortcuts from "../Dialogues/KeyboardShortcuts";
import togglePane from "../../functions/togglePane";


export default () => html`
<nav class=header-nav>
  <desktop-only>
  ${
    Button({
      content: `${ preferences.open_pane == 'styles' ? 'Close' : 'Open' } style editor`,
      icon: Icons.adjust,
      action: () => {
        toggleMenu(false);
        togglePane('styles');
      }
    })
  }
  </desktop-only>
${
  Button({
    content: 'Print current document',
    icon: Icons.print,
    action: printDocument
  })
}
${
  Button({
    content: 'Start an import',
    icon: Icons.import,
    action: () => renderAll(Modal(ImportDialogue()))
  })
}
${
  Button({
    content: 'Start an export',
    icon: Icons.export,
    action: () => {
      state.exportSelection = {};
      portables.map(key => state.exportSelection[key] = []);
      renderAll(Modal(ExportDialogue()))
    }
  })
}
${
  Button({
    icon: Icons.theme,
    content: html`Switch to <light>dark</light><dark>light</dark> theme`,
    action: () => setPreference('dark', !preferences.dark)
  })
}
${
  Button({
    icon: Icons.keyboard,
    content: html`Keyboard shortcuts`,
    action: () => renderAll(Modal(KeyboardShortcuts()))
  })
}
</nav>`;
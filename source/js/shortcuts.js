import ExportDialogue from "./components/Dialogues/ExportDialogue";
import ImportDialogue from "./components/Dialogues/ImportDialogue";
import Modal from "./components/Modal";
import addDocument from "./functions/addDocument";
import applyFormatting from "./functions/applyFormatting";
import moveField from "./functions/moveField";
import { autoSave, preferences, renderAll, setPreference } from "./state";
import { $ } from "./utils";

let applyEditorShortcut = (event, char) => {
  if (document.activeElement != $('.editor')) return;
  event.preventDefault();
  applyFormatting(char, char);
}

let handlFieldShortcut = (event, direction) => {
  let field = document.activeElement.closest('.field');

  if (field) {
    event.preventDefault();
    let index = parseInt(field.getAttribute('data-index'));
    moveField(index, direction);
  }
}

const shortcuts = {
  "b": event => applyEditorShortcut(event, '**'),
  "i": event => applyEditorShortcut(event, '_'),
  "`": event => applyEditorShortcut(event, '`'),
  "Delete": event => applyEditorShortcut(event, '~'),
  "Z": () => {
    setPreference('zen', !preferences.zen);
    renderAll();
  },
  "E": event => {
    event.preventDefault();
    renderAll(Modal(ExportDialogue()));
  },
  "M": event => {
    event.preventDefault();
    renderAll(Modal(ImportDialogue()));
  },
  "N": event => {
    event.preventDefault();
    addDocument();
  },
  "S": event => {
    event.preventDefault();
    autoSave();
  },
  "ArrowUp": event => handlFieldShortcut(event, -1),
  "ArrowDown": event => handlFieldShortcut(event, 1)
}

export default shortcuts;
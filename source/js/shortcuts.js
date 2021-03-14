import ExportDialogue from "./components/Dialogues/ExportDialogue";
import ImportDialogue from "./components/Dialogues/ImportDialogue";
import Modal from "./components/Modal";
import addDocument from "./functions/addDocument";
import applyFormatting from "./functions/applyFormatting";
import moveField from "./functions/moveField";
import printDocument from "./functions/printDocument";
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

export default {
  "b": {
    action: event => applyEditorShortcut(event, '**'),
    description: "format selection as bold",
    prefix: "ctrl"
  },
  "i": {
    action: event => applyEditorShortcut(event, '_'),
    description: "format selection as italics",
    prefix: "ctrl"
  },
  "`": {
    action: event => applyEditorShortcut(event, '`'),
    description: "format selection as source code",
    prefix: "ctrl"
  },
  "Delete": {
    action: event => applyEditorShortcut(event, '~'),
    description: "format selection as strikethrough",
    prefix: "ctrl"
  },
  "k": {
    action: () => {
      setPreference('zen', !preferences.zen);
      renderAll();
    },
    description: "toggle zen mode",
    prefix: "ctrl+shift"
  },
  "e": {
    action: event => {
      event.preventDefault();
      renderAll(Modal(ExportDialogue()));
    },
    description: "start an export",
    prefix: "ctrl+shift"
  },
  "m": {
    action: event => {
      event.preventDefault();
      renderAll(Modal(ImportDialogue()));
    },
    description: "start an import",
    prefix: "ctrl+shift"
  },
  "n": {
    action: event => {
      event.preventDefault();
      addDocument();
    },
    description: "add a new document",
    prefix: "ctrl+shift"
  },
  "s": {
    action: event => {
      event.preventDefault();
      autoSave();
    },
    description: "trigger a save",
    prefix: "ctrl+shift"
  },
  "p": {
    action: event => {
      event.preventDefault();
      printDocument();
    },
    description: "print your document",
    prefix: "ctrl"
  },
  "ArrowUp": {
    action: event => handlFieldShortcut(event, -1),
    description: "move the current field up",
    prefix: "ctrl"
  },
  "ArrowDown": {
    action: event => handlFieldShortcut(event, 1),
    description: "move the current field down",
    prefix: "ctrl"
  }
}
import state, { autoSave, preferences, renderAll, setPreference } from "../state";
import { isCharacterKey } from "../utils";
import suggestData from "./suggestData";


export let handleEditorInput = event => {
  state.currentDocument.body = event.target.value;
  suggestData();
  autoSave();
}

export let handleEditorFocusOut = event => {
  state.shortcutReady = false;
  state.intellisense.logger = '';
  if (preferences.zen) {
    setPreference('zen', false);
    renderAll();
  }
}

export let handleEditorKeyup = event => {

  let sense = state.intellisense;
  let key = event.key;

  if (isCharacterKey(event))
    sense.logger += key;

  switch (key) {
    case 'Backspace':
      sense.logger = sense.logger.slice(0, -1);
      break;
    case '{':
      sense.logger += key;
      break;
    case '}':
      sense.logger = '';
      break;
  }
}
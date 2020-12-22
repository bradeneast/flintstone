import shortcuts from "../shortcuts";
import state, { preferences, renderAll, setPreference } from "../state";
import { isCharacterKey } from "../utils";


export let handleEditorFocusOut = event => {
  state.shortcutReady = false;
  state.intellisense.logger = '';
  if (preferences.zen) {
    setPreference('zen', false);
    renderAll();
  }
}


export let handleEditorKeydown = event => {

  let key = event.key;

  if (key == 'Control')
    state.shortcutReady = true;

  if (state.shortcutReady && shortcuts[key]) {
    event.preventDefault();
    shortcuts[key]?.call();
  }
}


export let handleEditorKeyup = event => {

  let sense = state.intellisense;
  let key = event.key;

  if (event.key == 'Control')
    state.shortcutReady = false;

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
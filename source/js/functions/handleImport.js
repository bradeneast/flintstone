import ImportDialogue from "../components/Dialogues/ImportDialogue";
import Modal from "../components/Modal";
import { portables } from "../config";
import state, { handleError, renderAll, setState } from "../state";
import { deepCopy } from "../utils";


export default (event) => {

  let file;
  let reader = new FileReader();
  state.forImport = {};

  if (event.dataTransfer?.items) {
    event.preventDefault();
    file = event.dataTransfer.items[0].getAsFile();
  }
  else if (event.dataTransfer) {
    event.preventDefault();
    file = event.dataTransfer.files[0];
  }
  else {
    file = event.target.files[0];
  }

  reader.onerror = handleError;
  reader.onload = function () {
    let result = JSON.parse(this.result);
    portables.map(key => state.forImport[key] = result[key] || []);
    state.importSelection = deepCopy(state.forImport);
    state.loading = false;
    renderAll(Modal(ImportDialogue()));
  }

  setState('loading', true);
  reader.readAsText(file);
}
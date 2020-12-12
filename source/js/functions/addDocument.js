import state, { autoSave } from "../state"
import { $ } from "../utils";
import setCurrentDocument from "./setCurrentDocument";

export default () => {

  let newDocument = { id: "New Document", body: "" };
  state.currentUser.documents.push(newDocument);

  setCurrentDocument(state.currentUser.documents.length - 1);
  autoSave();

  $('.documents [data-active] input')?.focus();
}
import state from "../state"
import { $ } from "../utils";
import setCurrentDocument from "./setCurrentDocument";

export default () => {
  let newDocument = { id: "New Document", body: "" };
  state.currentUser.documents.push(newDocument);
  setCurrentDocument(state.currentUser.documents.length - 1);
  $('.documents [data-active] input')?.focus();
}
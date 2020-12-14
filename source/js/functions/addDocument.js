import UIAnimation from "../animations";
import state, { autoSave } from "../state"
import { $, selectByIndex } from "../utils";
import setCurrentDocument from "./setCurrentDocument";

export default () => {

  let newDocument = { id: "New Document", body: "" };
  let length = state.currentUser.documents.length;
  state.currentUser.documents.push(newDocument);
  setCurrentDocument(length);

  let targetItem = selectByIndex(length, $('.documents .sets'));
  let anim = new UIAnimation(targetItem);

  anim.added();

  $('.documents [data-active] input')?.focus();
  autoSave();
}
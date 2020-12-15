import UIAnimation from "../animations";
import state, { setState } from "../state"
import { $, selectByIndex } from "../utils";

export default (index) => {

  let docs = state.currentUser.documents;
  let currentDocument = docs[index];

  if (!confirm(`Are you sure you want to delete ${currentDocument.id}?`)) return;

  let targetItem = selectByIndex(index, $('.documents .sets'));
  let anim = new UIAnimation(targetItem, () => {
    docs.splice(index, 1);
    state.currentUser.documents = docs;
    setState('currentDocument', state.currentUser.documents[0], true);
  })

  anim.removed();
}
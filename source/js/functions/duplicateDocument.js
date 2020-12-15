import UIAnimation from "../animations";
import state, { setState } from "../state"
import { $, deepCopy, selectByIndex } from "../utils";

export default (index) => {

  let sourceDoc = state.currentUser.documents[index];
  let newDoc = deepCopy(sourceDoc);
  newDoc.id = sourceDoc.id + ' copy';
  state.currentUser.documents.push(newDoc);

  setState('currentUser', state.currentUser);
  setState('currentDocument', newDoc, true);

  let targetItem = selectByIndex(state.currentUser.documents.length - 1, $('.documents .sets'));
  let anim = new UIAnimation(targetItem);
  anim.added();
}
import state, { setState } from "../state"
import { deepCopy } from "../utils";
import renderPreview from "./renderPreview";

export default (index) => {

  let sourceDoc = state.currentUser.documents[index];
  let newDoc = deepCopy(sourceDoc);
  newDoc.id = sourceDoc.id + ' copy';
  state.currentUser.documents.push(newDoc);

  setState('currentUser', state.currentUser);
  setState('currentDocument', newDoc, true);

  if (state.showPreview)
    renderPreview();
}
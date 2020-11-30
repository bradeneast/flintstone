import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  let docs = state.currentUser.documents;
  docs.splice(index, 1);
  state.currentUser.documents = docs;

  setState('currentUser', state.currentUser);
  setState('currentDocument', state.currentUser.documents[0]);

  if (state.showPreview)
    renderPreview();
}
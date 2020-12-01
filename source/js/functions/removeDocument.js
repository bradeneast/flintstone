import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  if (!confirm('Are you sure you want to delete this document?')) return;

  let docs = state.currentUser.documents;
  docs.splice(index, 1);
  state.currentUser.documents = docs;

  setState('currentUser', state.currentUser);
  setState('currentDocument', state.currentUser.documents[0]);

  if (state.showPreview)
    renderPreview();
}
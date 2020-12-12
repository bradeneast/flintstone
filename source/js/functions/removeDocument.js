import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  let docs = state.currentUser.documents;
  let currentDocument = docs[index];

  if (!confirm(`Are you sure you want to delete ${currentDocument.id}?`)) return;

  docs.splice(index, 1);
  state.currentUser.documents = docs;

  setState('currentUser', state.currentUser);
  setState('currentDocument', state.currentUser.documents[0], true);

  if (state.showPreview)
    renderPreview();
}
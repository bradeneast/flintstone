import state, { setState } from "../state"
import setCurrentDocument from "./setCurrentDocument";

export default () => {
  let newDocument = { id: "New Document", body: "" }
  let documents = state.currentUser.documents;
  documents.push(newDocument);
  setState('currentUser', state.currentUser);
  setCurrentDocument(documents.length - 1);
}
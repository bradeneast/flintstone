import state, { setState } from "../state"

export default newName => {
  state.currentDocument.id = newName;
  setState('currentDocument', state.currentDocument);
}
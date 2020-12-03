import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default index => {
  setState('currentDocument', state.currentUser.documents[index]);
  if (state.showPreview)
    renderPreview();
}
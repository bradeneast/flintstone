import state, { findContractByID, setState } from "../state"
import renderPreview from "./renderPreview";

export default index => {
  setState('currentContract', state.currentUser.contracts[index]);
  if (state.showPreview)
    renderPreview();
}
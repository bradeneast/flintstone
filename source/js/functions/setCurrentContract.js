import state, { findContractByID, setState } from "../state"
import renderPreview from "./renderPreview";

export default event => {

  let attr = 'data-contract-id';
  let id = event.target.closest(`[${attr}]`).getAttribute(attr);
  setState('currentContract', findContractByID(id));

  if (state.showPreview)
    renderPreview();
}
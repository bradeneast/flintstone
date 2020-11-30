import state, { findDatasetByID } from "../state"
import renderPreview from "./renderPreview";

export default event => {

  let attr = 'data-dataset-id';
  let id = event.target.closest(`[${attr}]`).getAttribute(attr);
  setState('currentDataset', findDatasetByID(id));

  if (state.showPreview)
    renderPreview();
}
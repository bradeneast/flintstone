import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default index => {
  setState('currentDataset', state.currentUser.datasets[index]);
  if (state.showPreview)
    renderPreview();
}
import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  let sets = state.currentUser.datasets;
  sets.splice(index, 1);
  state.currentUser.datasets = sets;

  setState('currentUser', state.currentUser);
  setState('currentDataset', state.currentUser.datasets[0]);

  if (state.showPreview)
    renderPreview();
}
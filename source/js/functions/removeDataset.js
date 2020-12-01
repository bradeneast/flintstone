import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  if (!confirm('Are you sure you want to delete this data set?')) return;

  let sets = state.currentUser.datasets;
  sets.splice(index, 1);
  state.currentUser.datasets = sets;

  setState('currentUser', state.currentUser);
  setState('currentDataset', state.currentUser.datasets[0]);

  if (state.showPreview)
    renderPreview();
}
import state, { setState } from "../state"
import renderPreview from "./renderPreview";

export default (index) => {

  let sets = state.currentUser.datasets;
  let currentSet = sets[index];

  if (!confirm(`Are you sure you want to delete ${currentSet.id}?`)) return;

  sets.splice(index, 1);
  state.currentUser.datasets = sets;

  setState('currentUser', state.currentUser);
  setState('currentDataset', state.currentUser.datasets[0], true);

  if (state.showPreview)
    renderPreview();
}
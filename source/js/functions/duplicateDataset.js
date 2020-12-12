import state, { setState } from "../state"
import { deepCopy } from "../utils";
import renderPreview from "./renderPreview";

export default (index) => {

  let sourceSet = state.currentUser.datasets[index];
  let newSet = deepCopy(sourceSet);
  newSet.id = sourceSet.id + ' copy';
  state.currentUser.datasets.push(newSet);

  setState('currentUser', state.currentUser);
  setState('currentDataset', newSet, true);

  if (state.showPreview)
    renderPreview();
}
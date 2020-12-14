import UIAnimation from "../animations";
import state, { setState } from "../state"
import { $, selectByIndex } from "../utils";
import renderPreview from "./renderPreview";

export default (index) => {

  let sets = state.currentUser.datasets;
  let currentSet = sets[index];

  if (!confirm(`Are you sure you want to delete ${currentSet.id}?`)) return;

  let targetItem = selectByIndex(index, $('.data .sets'));
  let anim = new UIAnimation(targetItem, () => {
    sets.splice(index, 1);
    state.currentUser.datasets = sets;
    setState('currentDataset', state.currentUser.datasets[0], true);
  })

  anim.removed();

  if (state.showPreview)
    renderPreview();
}
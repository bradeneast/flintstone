import UIAnimation from "../animations";
import state, { setState } from "../state"
import { $, deepCopy, selectByIndex } from "../utils";
import renderPreview from "./renderPreview";

export default (index) => {

  let sourceSet = state.currentUser.datasets[index];
  let newSet = deepCopy(sourceSet);
  newSet.id = sourceSet.id + ' copy';
  state.currentUser.datasets.push(newSet);

  setState('currentUser', state.currentUser);
  setState('currentDataset', newSet, true);

  let targetItem = selectByIndex(index + 1, $('.data .sets'));
  let anim = new UIAnimation(targetItem);
  anim.added();
}
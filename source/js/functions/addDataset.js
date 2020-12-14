import UIAnimation from "../animations";
import state, { autoSave } from "../state"
import { $, selectByIndex } from "../utils";
import setCurrentDataset from "./setCurrentDataset";

export default () => {

  let newDataset = { id: "New Data", fields: [["", ""]] };
  let length = state.currentUser.datasets.length;
  state.currentUser.datasets.push(newDataset);
  setCurrentDataset(length);

  let targetItem = selectByIndex(length, $('.data .sets'));
  let anim = new UIAnimation(targetItem);
  anim.added();

  $('.data [data-active] input')?.focus();
  autoSave();
}
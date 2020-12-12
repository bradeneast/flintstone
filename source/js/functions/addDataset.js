import state, { autoSave } from "../state"
import { $ } from "../utils";
import setCurrentDataset from "./setCurrentDataset";

export default () => {

  let newDataset = { id: "New Data", fields: [["", ""]] };
  state.currentUser.datasets.push(newDataset);

  setCurrentDataset(state.currentUser.datasets.length - 1);
  autoSave();

  $('.data [data-active] input')?.focus();
}
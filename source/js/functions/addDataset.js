import state, { setState } from "../state"
import setCurrentDataset from "./setCurrentDataset";

export default () => {
  let newDataset = { id: "New Dataset", fields: [] }
  let datasets = state.currentUser.datasets;
  datasets.push(newDataset);
  setState('currentUser', state.currentUser);
  setCurrentDataset(datasets.length - 1);
}
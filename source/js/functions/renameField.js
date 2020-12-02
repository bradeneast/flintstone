import state, { setState } from "../state"

export default (index, newKey) => {

  let [key, value] = state.currentDataset.fields[index];
  state.currentDataset.fields[index] = [newKey, value];

  setState('currentDataset', state.currentDataset);
}
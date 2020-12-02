import state, { setState } from "../state"

export default (index, newValue) => {

  let [key, value] = state.currentDataset.fields[index];
  state.currentDataset.fields[index] = [key, newValue];

  setState('currentDataset', state.currentDataset);
}
import state, { setState } from "../state"

export default newName => {
  state.currentDataset.id = newName;
  setState('currentDataset', state.currentDataset, true);
}
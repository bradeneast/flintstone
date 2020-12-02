import state, { setState } from "../state"

export default (index) => {
  state.currentDataset.fields.splice(index, 1);
  setState('currentDataset', state.currentDataset);
}
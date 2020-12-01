import state, { setState } from "../state"

export default () => {
  state.currentDataset.fields.push(['', '']);
  setState('currentDataset', state.currentDataset);
}
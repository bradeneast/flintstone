import state, { setState } from "../state";

export default index => {
  setState('currentDataset', state.currentUser.datasets[index]);
}
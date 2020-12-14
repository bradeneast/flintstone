import UIAnimation from "../animations";
import state, { setState } from "../state";
import { $, selectByIndex } from "../utils";

export default () => {

  state.currentDataset.fields.push(['', '']);
  setState('currentDataset', state.currentDataset, true);

  let targetField = selectByIndex(state.currentDataset.fields.length - 1, $('.fields'));
  new UIAnimation(targetField).added();
}
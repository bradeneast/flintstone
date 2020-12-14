import state, { setState } from "../state";
import UIAnimation from '../animations';
import { $, selectByIndex } from "../utils";


export default (index) => {
  let targetField = selectByIndex(index, $('.fields'));
  let anim = new UIAnimation(targetField, () => {
    state.currentDataset.fields.splice(index, 1);
    setState('currentDataset', state.currentDataset, true);
  });

  anim.removed();
}
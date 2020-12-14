import { selectFieldByIndex } from "../components/Field";
import state, { setState } from "../state"
import { setCustomProp } from "../utils";


export default (index) => {

  let targetField = selectFieldByIndex(index);
  setCustomProp(targetField, 'scaleY', 0);

  setTimeout(() => {
    state.currentDataset.fields.splice(index, 1);
    setState('currentDataset', state.currentDataset, true);
    targetField.style.transition = 'none';
    setCustomProp(targetField, 'scaleY', 1);
    setTimeout(() => targetField.style.transition = '', 300);
  }, 300);
}
import { selectFieldByIndex } from "../components/Field";
import state, { setState } from "../state"
import { setCustomProp } from "../utils";

export default () => {
  state.currentDataset.fields.push(['', '']);
  setState('currentDataset', state.currentDataset, true);

  let targetField = selectFieldByIndex(state.currentDataset.fields.length - 1);
  targetField.style.transition = 'none';
  targetField.style.opacity = 0;
  setCustomProp(targetField, 'translateY', 1);
  setCustomProp(targetField, 'scaleY', 0);

  setTimeout(() => {
    targetField.style.transition = '';
    targetField.style.opacity = 1;
    setCustomProp(targetField, 'translateY', 0);
    setCustomProp(targetField, 'scaleY', 1);
  }, 10);
}
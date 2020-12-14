import state, { setState } from "../state"
import { $, setCustomProp } from "../utils";
import { selectFieldByIndex } from '../components/Field';

export default (fieldIndex, amount) => {

  document.activeElement.blur();

  let direction = amount > 0 ? 'down' : 'up';
  let field = state.currentDataset.fields[fieldIndex];
  let newIndex = fieldIndex + amount;
  let currentField = selectFieldByIndex(fieldIndex);
  let targetField = selectFieldByIndex(newIndex);

  state.currentDataset.fields.splice(fieldIndex, 1);
  state.currentDataset.fields.splice(newIndex, 0, field);
  setState('currentDataset', state.currentDataset, true);

  setCustomProp(currentField, 'translateY', amount);
  setCustomProp(targetField, 'translateY', amount * -1);

  for (let fieldElem of [currentField, targetField])
    fieldElem.style.transition = 'none';

  setTimeout(() => {

    for (let li of [currentField, targetField]) {
      li.style.transition = '';
      setCustomProp(li, 'translateY', 0);
    }

    $(`[title*="${direction}"]`, targetField).focus();
  }, 10);

}
import state, { setState } from "../state"
import { $ } from "../utils";

export default (fieldIndex, amount) => {

  document.activeElement.blur();

  let selectFieldByIndex = index => $(`.fields li[data-index="${index}"]`);
  let setCustomProp = (elem, prop, value) => elem.style.setProperty(`--${prop}`, value);
  let direction = amount > 0 ? 'down' : 'up';
  let field = state.currentDataset.fields[fieldIndex];
  let newIndex = fieldIndex + amount;

  state.currentDataset.fields.splice(fieldIndex, 1);
  state.currentDataset.fields.splice(newIndex, 0, field);
  setState('currentDataset', state.currentDataset, true);

  let currentField = selectFieldByIndex(fieldIndex);
  let targetField = selectFieldByIndex(newIndex);

  setCustomProp(currentField, 'amt', amount);
  setCustomProp(targetField, 'amt', amount * -1);

  for (let { style } of [currentField, targetField]) {
    style.animation = 'none';
    style.transition = 'none';
  }

  setTimeout(() => {
    for (let li of [currentField, targetField]) {
      li.style.transition = '';
      setCustomProp(li, 'amt', 0);
    }
    $(`[title*="${direction}"]`, targetField).focus();
  }, 10);

}
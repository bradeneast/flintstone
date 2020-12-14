import state, { setState } from "../state"
import { $, selectByIndex } from "../utils";
import UIAnimation from "../animations";

export default (fieldIndex, amount) => {

  document.activeElement.blur();

  let direction = amount > 0 ? 'down' : 'up';
  let field = state.currentDataset.fields[fieldIndex];
  let newIndex = fieldIndex + amount;
  let fieldsList = $('.fields');
  let currentField = selectByIndex(fieldIndex, fieldsList);
  let targetField = selectByIndex(newIndex, fieldsList);

  state.currentDataset.fields.splice(fieldIndex, 1);
  state.currentDataset.fields.splice(newIndex, 0, field);
  setState('currentDataset', state.currentDataset, true);

  let anim = new UIAnimation([currentField, targetField], () =>
    $(`[title*="${direction}"]`, targetField).focus()
  );
  anim.swapped(amount);

}
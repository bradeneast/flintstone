import state, { setState } from "../state"
import { $ } from "../utils";

export default (fieldIndex, amount) => {

  let field = state.currentDataset.fields[fieldIndex];
  let newIndex = fieldIndex + amount;
  state.currentDataset.fields.splice(fieldIndex, 1);
  state.currentDataset.fields.splice(newIndex, 0, field);

  setState('currentDataset', state.currentDataset);
}
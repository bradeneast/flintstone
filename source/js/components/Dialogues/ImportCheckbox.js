import { html } from "lit-html";
import state, { renderAll } from "../../state";
import { deepCopy } from "../../utils";
import Modal from "../Modal";
import ImportDialogue from "./ImportDialogue";


export default (item, itemIndex, itemType) => {

  let inputName = `${item.id}_${itemIndex}`;

  let handleCheckboxInput = (event) => {
    event.target.checked
      ? state.importSelection[itemType].push(deepCopy(item))
      : state.importSelection[itemType] = state.importSelection[itemType].filter(i => i.id != item.id);
    renderAll(Modal(ImportDialogue()));
  }

  return html`
  <label class=flex style="margin-bottom: .5rem">
    <input checked name=${inputName} type=checkbox @input=${handleCheckboxInput} />
    <h3>${item.id}</h3>
  </label>`;
}
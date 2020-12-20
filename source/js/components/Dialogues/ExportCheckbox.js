import { html } from "lit-html";
import state, { renderAll } from "../../state";
import { deepCopy } from "../../utils";
import Modal from "../Modal";
import ExportDialogue from "./ExportDialogue";


export default (item, itemIndex, itemType) => {

  let inputName = `${item.id}_${itemIndex}`;

  let handleCheckboxInput = (event) => {
    event.target.checked
      ? state.exportSelection[itemType].push(deepCopy(item))
      : state.exportSelection[itemType] = state.exportSelection[itemType].filter(i => i.id != item.id);
    renderAll(Modal(ExportDialogue()))
  }

  return html`
  <label class="flex" style="margin-bottom: .5rem">
    <input name=${inputName} type=checkbox @input=${handleCheckboxInput} />
    <h3>${item.id}</h3>
  </label>`;
}
import state, { setState } from "../state"
import { $, getSelectionData } from "../utils"

export default () => {

  let box = $('intellisense');
  let editor = $('.editor');
  let mapper = $('.intellisense-mapper');

  mapper.textContent = editor.value;

  let { selection, before, after } = getSelectionData(editor);
  let tester = new RegExp(selection, 'i');

  let { offsetHeight, offsetWidth, offsetLeft, offsetTop } = mapper;
  let posY = offsetTop + offsetHeight / 2;
  let posX = offsetLeft + offsetWidth;
  box.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

  setState('suggestions', state.currentDataset.fields.filter(f => tester.test(f.key)))
}
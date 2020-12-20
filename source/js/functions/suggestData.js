import state, { setState } from "../state"
import { $, escapeRegExp, getSelectionData } from "../utils"

export default () => {

  let sense = state.intellisense;
  let box = $('.intellisense');
  let mapper = $('.intellisense-mapper');
  let editor = $('.editor');

  let { before } = getSelectionData(editor);
  let allLines = before.split(/\n/);
  let currentLine = allLines.pop();
  let source = before.split('{').pop().trim();
  let tester = new RegExp(escapeRegExp(source), 'i');

  mapper.innerText = allLines.slice(0, -1).join('\n').replace(/[A-z0-9]+/g, '') + '\n' + currentLine;

  let { offsetHeight, offsetWidth, offsetLeft, offsetTop } = mapper;
  let posY = offsetTop + offsetHeight;
  let posX = offsetLeft + offsetWidth;

  box.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
  sense.suggestions = state.currentDataset.fields.filter(f => tester.test(f[0]));

  setState('intellisense', sense);
}
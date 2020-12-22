import state, { setState } from "../state"
import { $, escapeRegExp, getSelectionData } from "../utils"

export default () => {

  let sense = state.intellisense;
  let box = $('.intellisense');
  let mapper = $('.intellisense-mapper');
  let mapperFirstLines = $('.first-lines', mapper)
  let mapperLastLine = $('.last-line', mapper);
  let editor = $('.editor');

  let { before } = getSelectionData(editor);
  let allLines = before.split(/\n/);
  let currentLine = allLines.splice(-1, 1);
  let source = before.split('{').pop().trim();
  let tester = new RegExp(escapeRegExp(source), 'i');

  mapperFirstLines.innerText = allLines.join('\n') + `\n`;
  mapperLastLine.innerText = currentLine;

  let { offsetHeight, offsetWidth, offsetLeft, offsetTop } = mapperLastLine;
  let posY = offsetTop + offsetHeight;
  let posX = offsetLeft + offsetWidth;

  box.style.transform = `translate3d(${posX}px, ${posY - editor.scrollTop}px, 0)`;
  sense.suggestions = state.currentDataset.fields.filter(f => tester.test(f[0]));

  setState('intellisense', sense);
}
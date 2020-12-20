import state, { autoSave } from "../state";
import { $, getSelectionData, indexOfExp, lastIndexOfExp } from "../utils";


export default (char) => {

  let editor = $('.editor');
  if (document.activeElement != editor) return;
  let { selection, selectionStart, selectionEnd, before, after } = getSelectionData(editor);
  let charLength = char.length;
  let minusCharLength = charLength * -1;
  let wordBoundary = /\s/;
  let wasFormatted = false;

  // Format the selected text
  if (selectionEnd - selectionStart > 0) {

    let formattingBefore = before.slice(minusCharLength) == char;
    let formattingAfter = after.slice(0, charLength) == char;
    wasFormatted = formattingBefore && formattingAfter;

    if (wasFormatted)
      state.currentDocument.body = before.slice(0, minusCharLength) + selection + after.slice(charLength);

    if (!wasFormatted)
      state.currentDocument.body = before + char + selection + char + after;
  }

  // Format the word at the current cursor position if there is no selection
  if (selectionEnd - selectionStart == 0) {

    let beforeWord = before.substr(0, lastIndexOfExp(before, wordBoundary) + 1);
    let afterWord = after.substr(indexOfExp(after, wordBoundary));
    let formattingBefore = selection.slice(0, charLength) == char;
    let formattingAfter = selection.slice(minusCharLength) == char;
    wasFormatted = formattingBefore && formattingAfter;

    selection = wasFormatted
      ? selection.slice(charLength, minusCharLength)
      : char + selection + char;

    state.currentDocument.body = beforeWord + selection + afterWord;
  }


  editor.value = state.currentDocument.body;
  autoSave();

  let selectionShift = wasFormatted ? minusCharLength : charLength;
  editor.selectionStart = selectionStart + selectionShift;
  editor.selectionEnd = selectionEnd + selectionShift;
}
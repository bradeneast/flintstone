import state, { autoSave } from "../state";
import { $, indexOfExp, lastIndexOfExp } from "../utils";


export default (char) => {

  let editor = $('.editor');
  if (document.activeElement != editor) return;
  let { selectionStart, selectionEnd } = editor;
  let body = state.currentDocument.body;
  let charLength = char.length;
  let minusCharLength = charLength * -1;
  let wordBoundary = /\s/;
  let wasFormatted = false;

  let selection = body.substring(selectionStart, selectionEnd);
  let beforeSelection = body.substr(0, selectionStart);
  let afterSelection = body.substr(selectionEnd);

  // Format the selected text
  if (selection.length) {

    let formattingBefore = beforeSelection.slice(minusCharLength) == char;
    let formattingAfter = afterSelection.slice(0, charLength) == char;
    wasFormatted = formattingBefore && formattingAfter;

    if (wasFormatted)
      state.currentDocument.body = beforeSelection.slice(0, minusCharLength) + selection + afterSelection.slice(charLength);

    if (!wasFormatted)
      state.currentDocument.body = beforeSelection + char + selection + char + afterSelection;
  }

  // Format the word at the current cursor position if there is no selection
  if (!selection.length) {

    let selectionWord = beforeSelection.split(wordBoundary).pop() + afterSelection.split(wordBoundary).shift();
    let beforeSelectionWord = beforeSelection.substr(0, lastIndexOfExp(beforeSelection, wordBoundary) + 1);
    let afterSelectionWord = afterSelection.substr(indexOfExp(afterSelection, wordBoundary));
    let formattingBefore = selectionWord.slice(0, charLength) == char;
    let formattingAfter = selectionWord.slice(minusCharLength) == char;
    wasFormatted = formattingBefore && formattingAfter;

    selectionWord = wasFormatted
      ? selectionWord.slice(charLength, minusCharLength)
      : char + selectionWord + char;

    state.currentDocument.body = beforeSelectionWord + selectionWord + afterSelectionWord;
  }


  editor.value = state.currentDocument.body;
  autoSave();

  let selectionShift = wasFormatted ? minusCharLength : charLength;
  editor.selectionStart = selectionStart + selectionShift;
  editor.selectionEnd = selectionEnd + selectionShift;
}
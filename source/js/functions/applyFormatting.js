import state, { autoSave } from "../state";
import { $, getSelectionData, indexOfExp, lastIndexOfExp } from "../utils";


export default (prefix, suffix) => {

  let editor = $('.editor');
  if (document.activeElement != editor) return;
  let { selection, selectionStart, selectionEnd, before, after } = getSelectionData(editor);
  let prefixLength = prefix.length;
  let minusPrefixLength = prefixLength * -1;
  let suffixLength = suffix.length;
  let minusSuffixLength = suffix.length * -1;
  let wordBoundary = /\s/;
  let wasFormatted = false;

  // Format the selected text
  if (selectionEnd - selectionStart > 0) {

    let formattingBefore = before.slice(minusPrefixLength) == prefix;
    let formattingAfter = after.slice(0, suffixLength) == suffix;
    wasFormatted = formattingBefore && formattingAfter;

    wasFormatted
      ? state.currentDocument.body = before.slice(0, minusPrefixLength) + selection + after.slice(suffixLength)
      : state.currentDocument.body = before + prefix + selection + suffix + after;
  }

  // Format the word at the current cursor position if there is no selection
  if (selectionEnd - selectionStart == 0) {

    let beforeWord = before.substr(0, lastIndexOfExp(before, wordBoundary) + 1);
    let afterWord = after.substr(indexOfExp(after, wordBoundary));
    let formattingBefore = selection.slice(0, prefixLength) == prefix;
    let formattingAfter = selection.slice(minusSuffixLength) == suffix;
    wasFormatted = formattingBefore && formattingAfter;

    selection = wasFormatted
      ? selection.slice(prefixLength, minusSuffixLength)
      : prefix + selection + suffix;

    state.currentDocument.body = beforeWord + selection + afterWord;
  }


  editor.value = state.currentDocument.body;
  autoSave();

  let selectionShift = wasFormatted ? -1 : 1;
  editor.selectionStart = selectionStart + (prefixLength * selectionShift);
  editor.selectionEnd = selectionEnd + (suffixLength * selectionShift);
}
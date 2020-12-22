import { html } from "lit-html";
import { handleEditorFocusOut, handleEditorInput, handleEditorKeyup } from "../../functions/editorHandlers";
import state from "../../state";
import Intellisense from "./Intellisense";

export default () => html`
<textarea class=editor placeholder="Start typing when you're ready..." @keyup=${handleEditorKeyup}
  @focusout=${handleEditorFocusOut} @input=${handleEditorInput}>${state.currentDocument.body}</textarea>
${Intellisense()}
`;
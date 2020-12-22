import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { handleEditorFocusOut, handleEditorKeyup } from "../functions/editorHandlers";
import makePreviewStyles from "../functions/makePreviewStyles";
import suggestData from "../functions/suggestData";
import state, { autoSave, setState } from '../state';
import { $, getSelectionData } from "../utils";
import Button from "./Button";
import DocumentPreview from "./Documents/DocumentPreview";


export default () => html`
<toolbar>
  <button 
  ?data-active=${!state.showPreview} 
  title="Show editor" 
  class=icon
  @click=${()=> setState('showPreview', false)}>
    ✍️
  </button>
  <button 
  ?data-active=${state.showPreview} 
  title="Show preview" 
  class=icon
  @click=${() => setState('showPreview', true)}>
    👀
  </button>
  <a 
  title="Format your text like a pro with the Markdown cheatsheet."
  class="button icon" 
  rel="noopener"
  target=_blank 
  href="https://www.markdownguide.org/cheat-sheet/">
    ❓
  </a>
</toolbar>

${
  state.showPreview
  
    ? html`
    <div class=preview>
      <div class=preview__wrapper>
        ${DocumentPreview()}
      </div>
    </div>
    ${unsafeHTML(makePreviewStyles())}`

    : html`
    <textarea 
    class=editor 
    placeholder="Start typing when you're ready..."
    @keyup=${handleEditorKeyup}
    @focusout=${handleEditorFocusOut}
    @input=${event => {
      state.currentDocument.body = event.target.value;
      suggestData();
      autoSave();
    }}>${state.currentDocument.body}</textarea>

    <div class='intellisense-mapper'>
      <span class='first-lines'></span>
      <span class='last-line'></span>
    </div>
    
    <ul class=intellisense ?data-active=${state.intellisense.suggestions?.length}>
      ${state.intellisense.suggestions.map(([key, value]) => html`
      <li>${
          Button({
            content: html`<strong>${key}</strong> <span class="light">(${value})</span>`,
            className: 'link',
            action: () => {
              
              let editor = $('.editor');
              let { before, after } = getSelectionData(editor);
              let throughKey = before.replace(/\{(.(?!\{))*?$/, '') + '{ ' + key + ' }';

              editor.value = throughKey + after;
              state.currentDocument.body = editor.value;
              state.intellisense = { logger: '', suggestions: [] };
              setState('intellisense', state.intellisense, true);

              editor.focus();
              editor.setSelectionRange(throughKey.length, throughKey.length);
            }
          })
      }</li>`)}
    </ul>`
}`;
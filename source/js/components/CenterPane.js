import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import applyFormatting from "../functions/applyFormatting";
import { handleEditorKeydown, handleEditorKeyup } from "../functions/editorHandlers";
import makePreviewStyles from "../functions/makePreviewStyles";
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
    @keydown=${handleEditorKeydown}
    @keyup=${handleEditorKeyup}
    @input=${event => {
      state.currentDocument.body = event.target.value;
      autoSave();
    }}>${state.currentDocument.body}</textarea>

    <span class=intellisense-mapper></span>
    
    <ul class=intellisense ?data-active=${state.intellisense.suggestions?.length}>
      ${state.intellisense.suggestions.map(([key, value]) => html`
      <li>${
          Button({
            content: html`<strong>${key}</strong> <span class="light">(${value})</span>`,
            className: 'link',
            action: () => {
              let editor = $('.editor');
              let { before, after } = getSelectionData(editor);
              before = before.replace(/\{.*?$/, '');
              editor.value = before + '{ ' + key + ' }' + after;
              state.intellisense = { logger: '', suggestions: [], ready: false };
              setState('intellisense', state.intellisense);
            }
          })
      }</li>`
      )}
    </ul>`
  }`;
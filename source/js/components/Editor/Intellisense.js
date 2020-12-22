import { html } from "lit-html";
import state, { setState } from "../../state";
import { $, getSelectionData } from "../../utils";
import Button from "../Button";


export default () => html`
<div class='intellisense-mapper'>
  <span class='first-lines'></span>
  <span class='last-line'></span>
</div>

<ul class=intellisense ?data-active=${state.intellisense.suggestions?.length && state.currentDocument.body.includes('{') && document.activeElement == $('.editor')}>
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
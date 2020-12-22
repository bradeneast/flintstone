import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import makePreviewStyles from "../functions/makePreviewStyles";
import state, { setState } from '../state';
import DocumentPreview from "./Documents/DocumentPreview";
import Editor from "./Editor/Editor";


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
    : Editor()
}`;
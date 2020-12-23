import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import makePreviewStyles from "../functions/makePreviewStyles";
import state, { setState } from '../state';
import Button from "./Button";
import DocumentPreview from "./Documents/DocumentPreview";
import Editor from "./Editor/Editor";
import Icons from "./Icons";


export default () => html`
<toolbar>
  ${
    Button({
      title: 'Show Editor',
      className: 'icon' + (state.showPreview ? '' : ' active'),
      action: () => setState('showPreview', false),
      icon: Icons.edit
    })
  }
  ${
    Button({
      title: 'Show Preview',
      className: 'icon' + (state.showPreview ? ' active' : ''),
      action: () => setState('showPreview', true),
      icon: Icons.preview
    })
  }
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
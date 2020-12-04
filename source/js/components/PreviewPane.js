import renderPreview from "../functions/renderPreview";
import { html } from "../lit-html/lit-html";
import { unsafeHTML } from '../lit-html/directives/unsafe-html';
import { dataMatcher, hydrateFromDataset } from "../functions/renderPreview";
import state, { setState } from '../state';
import { resolvePromise } from "../utils";


export default () => {

  /**Generate preview styles based on user settings or defaults */
  let makeStyleRule = ([propName, propValue]) => {
    if (/content|font-family/i.test(propName)) {
      if (propValue.length)
        propValue = '"' + propValue.replace(/"/g, '\\"') + '"';
      else return;
    }
    propValue = propValue.replace(dataMatcher, hydrateFromDataset);
    return [propName, propValue].join(':')
  }

  let previewStyles = `
  <style>${
  Object.entries(state.styles)
    .map(([tagName, prop]) => 
      `.preview ${tagName} {
        ${Object.entries(prop).map(makeStyleRule).join(';')}
      }`
    )
    .join('')
  }</style>`;

  /*******************/

  return html`

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
          ${resolvePromise(renderPreview())}
        </div>
      </div>
      ${unsafeHTML(previewStyles)}`
      : html`
      <textarea 
      class=editor 
      placeholder="Begin writing here..."
      @input=${event=> state.currentDocument.body = event.target.value}>${state.currentDocument.body}</textarea>`
  }
`;
}
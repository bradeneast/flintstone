import renderPreview from "../functions/renderPreview";
import { html } from "../lit-html/lit-html";
import {unsafeHTML} from '../lit-html/directives/unsafe-html';
import state, { setState } from '../state';


export default () => {

  let previewStyles = `<style>
  ${Object.entries(state.styles)
    .map(([tagName, prop]) => `
      .preview ${tagName} {
        ${Object.entries(prop)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join(';')
        }
      }`)
    .join('')
  }
  </style>`;

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
    @click=${renderPreview}>
      👀
    </button>
  </toolbar>

  ${
    state.showPreview
      ? html`
      <div class=preview>
        <div class=preview__wrapper></div>
      </div>
      ${unsafeHTML(previewStyles)}`
      : html`
      <textarea class=editor @input=${event=> state.currentDocument.body = event.target.value}>${state.currentDocument.body}</textarea>`
  }
`;
}
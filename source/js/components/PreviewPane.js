import renderPreview from "../functions/renderPreview";
import { html } from "../lit-html/lit-html";
import state, { setState } from '../state';


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
    @click=${renderPreview}>
      👀
    </button>
  </toolbar>

  ${
    state.showPreview
      ? html`<div class=preview></div>`
      : html`<textarea class=editor @input=${event=> state.currentDocument.body = event.target.value}>${state.currentDocument.body}</textarea>`
  }
`
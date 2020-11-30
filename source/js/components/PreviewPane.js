import renderPreview from "../functions/renderPreview";
import { html } from "../lit-html/lit-html";
import state, { setState } from '../state';


export default () => html`

  <toolbar>
    <button class="tab" ?data-active=${!state.showPreview} @click=${()=> setState('showPreview', false)}>
      Editor
    </button>
    <button class="tab" ?data-active=${state.showPreview} @click=${renderPreview}>
      Preview
    </button>
  </toolbar>

  ${
    state.showPreview
      ? html`<div class=preview></div>`
      : html`<textarea class=editor @input=${event=> state.currentContract.body = event.target.value}>${state.currentContract.body}</textarea>`
  }
`
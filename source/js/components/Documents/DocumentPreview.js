import state, { setState } from '../../state';
import { sanitize } from 'dompurify'
import marked from 'marked';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { makePageID } from './DocumentTOC';


export function getFieldValue(prop) {
  for (let [key, value] of state.currentDataset.fields)
    if (key == prop)
      return value;
}


export function hydrateFromDataset(string) {
  return getFieldValue(
    string.slice(1, -1).trim(),
    state.currentDataset.fields
  )
}


export let dataMatcher = /\{.+?\}/g;


export default () => {

  if (!state.currentDocument.body.length)
    return html`
    <div class=preview__page>
      <p>
        Write something in <a class=link @click=${()=> setState('showPreview', false)}>the editor</a> to see it
        show
        up here.
      </p>
    </div>`

  let hydrated = state.currentDocument.body.replace(dataMatcher, hydrateFromDataset);
  let sanitized = sanitize(marked(hydrated));
  return sanitized
    .split('<hr>')
    .map((pageContent, index) => html`
      <div id=${makePageID(index)} class=preview__page>
        ${unsafeHTML(pageContent)}
      </div>`
    );
}
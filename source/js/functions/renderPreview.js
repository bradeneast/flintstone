import state from '../state';
import purify from '../dom-purify/purify';
import marked from '../marked/marked';
import { html } from '../lit-html/lit-html';
import { unsafeHTML } from '../lit-html/directives/unsafe-html';


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


export default async () => {

  let hydrated = state.currentDocument.body.replace(dataMatcher, hydrateFromDataset);
  let sanitized = purify.sanitize(marked(hydrated));

  return sanitized
    .split('<hr>')
    .map(pageContent => html`<div class=preview__page>${unsafeHTML(pageContent)}</div>`)
}
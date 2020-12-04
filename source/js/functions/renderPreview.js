import state from '../state';
import { $ } from '../utils';
import purify from '../dom-purify/purify';
import marked from '../marked/marked';


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

  let previewWrapper = $('.preview__wrapper');
  let hydrated = state.currentDocument.body.replace(dataMatcher, hydrateFromDataset);
  let sanitized = purify.sanitize(marked(hydrated));

  previewWrapper.innerHTML = '';

  for (let pageContent of sanitized.split('<hr>')) {
    let pageElement = document.createElement('div');
    pageElement.classList.add('preview__page');
    pageElement.innerHTML = pageContent;
    previewWrapper.append(pageElement);
  }
}
import state, { setState } from '../state';
import { $ } from '../utils';
import purify from '../dom-purify/purify';
import marked from '../marked/marked';

export default () => {

  setState('showPreview', true);
  let fields = state.currentDataset.fields;

  function getProp(prop) {
    for (let [key, value] of fields)
      if (key == prop)
        return value;
  }

  function hydrate(string) {
    return getProp(string.slice(1, -1).trim(), fields)
  }

  let preview = $('.preview');
  let hydrated = state.currentDocument.body.replace(/\{.+?\}/g, hydrate);
  let parsed = marked(hydrated);
  preview.innerHTML = purify.sanitize(parsed);
}
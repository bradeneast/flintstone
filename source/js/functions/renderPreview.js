import state, { setState } from '../state';
import { $ } from '../utils';
import purify from '../dom-purify/purify';
import tinymd from '../tiny-markdown/tiny-markdown';

export default () => {

  setState('showPreview', true);
  let fields = state.currentDataset.fields;

  function getProp(prop) {
    for (let [key, value] of fields)
      if (key == prop)
        return value;
  }

  function hydrate(string) {
    return getProp(string.slice(1, -1), fields)
  }

  let preview = $('.preview');
  let hydrated = state.currentContract.body.replace(/\{.+?\}/g, hydrate);
  let parsed = tinymd(hydrated);
  preview.innerHTML = purify.sanitize(parsed);
}
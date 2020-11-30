import state, { setState } from '../state';
import { $ } from '../utils';
import purify from '../dom-purify/purify';
import tinymd from '../tiny-markdown/tiny-markdown';

export default () => {
  setState('showPreview', true);

  let preview = $('.preview');
  let parsed = tinymd(state.currentContract.body);
  preview.innerHTML = purify.sanitize(parsed);
}
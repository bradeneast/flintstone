import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave, setState } from './state';
import { tags } from './style_data';
import { $$ } from './utils';


if (!state.savedLocally) {
  document.documentElement.classList.add('loading');

  fetch('/defaults.json')
    .then(r => r.json())
    .then(defaultState => {

      Object.keys(state).map(key => state[key] = defaultState[key]);
      state.currentDataset = state.currentUser.datasets[0];
      state.currentDocument = state.currentUser.documents[0];

      Object.keys(tags).map(tagName =>
        state.styles[tagName] = state.styles[tagName] || {}
      );

      setState('styles', state.styles);
    })
    .then(() => document.documentElement.classList.remove('loading'))
}
else {

  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  document.documentElement.classList.toggle('dark', state.dark);

  state.styles = state.styles || {};
  Object.keys(tags).map(tagName =>
    state.styles[tagName] = state.styles[tagName] || {}
  );

  state.showPreview
    ? renderPreview()
    : renderAll();

  autoSave();
}
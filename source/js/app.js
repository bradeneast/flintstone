import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave, defaultState } from './state';
import { tags } from './style_data';


if (!state.savedLocally) {
  document.documentElement.classList.add('loading');

  defaultState
    .then(defaultState => {

      Object.keys(defaultState).map(key => state[key] = defaultState[key]);
      state.currentDataset = state.currentUser.datasets[0];
      state.currentDocument = state.currentUser.documents[0];

      Object.keys(tags).map(key => state.styles[key] = state.styles[key] || {});
      renderAll();
      autoSave();
    })
    .then(() => document.documentElement.classList.remove('loading'))
}
else {

  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  state.savedLocally = state.savedLocally || false;
  state.showPreview = state.showPreview || false;
  state.showStyles = state.showStyles || false;
  state.dark = state.dark || false;
  state.styles = state.styles || {};
  state.expandedAdjustments = state.expandedAdjustments || ["global", "pages"];

  document.documentElement.classList.toggle('dark', state.dark);

  Object.keys(tags).map(tagName =>
    state.styles[tagName] = state.styles[tagName] || {}
  );

  renderAll();
  autoSave();
  if (state.showPreview)
    renderPreview();
}
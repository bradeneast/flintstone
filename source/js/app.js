import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave } from './state';
import { tags } from './style_data';


if (!state.savedLocally) {
  document.documentElement.classList.add('loading');

  fetch('/db.json')
    .then(r => r.json())
    .then(users => users[0])
    .then(user => {
      state.currentUser = user;
      state.currentDocument = state.currentUser.documents[0];
      state.currentDataset = state.currentUser.datasets[0];
      Object.keys(tags).map(tagName => state.styles[tagName] = {});
    })
    .then(renderAll)
    .then(autoSave)
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
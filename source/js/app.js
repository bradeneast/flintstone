import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave } from './state';


if (!state.savedLocally) {
  document.documentElement.classList.add('loading');

  fetch('/db.json')
    .then(r => r.json())
    .then(users => users.find(user => user.name == 'Nathan'))
    .then(user => {
      state.currentUser = user;
      state.currentDocument = state.currentUser.documents[0];
      state.currentDataset = state.currentUser.datasets[0];
    })
    .then(renderAll)
    .then(autoSave)
    .then(() => document.documentElement.classList.remove('loading'))
}
else {
  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];

  state.showPreview
    ? renderPreview()
    : renderAll();

  autoSave();
}
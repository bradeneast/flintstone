import state, { renderAll, autoSave } from './state';


if (!state.savedLocally) {
  document.documentElement.classList.add('loading');

  fetch('/db.json')
    .then(r => r.json())
    .then(users => users.find(user => user.name == 'Nathan'))
    .then(user => {
      state.currentUser = user;
      state.currentContract = state.currentUser.contracts[0];
      state.currentDataset = state.currentUser.datasets[0];
    })
    .then(renderAll)
    .then(autoSave)
    .then(() => document.documentElement.classList.remove('loading'))
}

renderAll();
autoSave();
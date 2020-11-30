import state, { renderAll, autoSave } from './state';

(async function () {
  document.documentElement.classList.add('loading');

  if (!state.savedLocally) {
    let users = await fetch('/db.json').then(r => r.json());
    state.currentUser = users.find(user => user.name == 'Nathan');
    state.currentContract = state.currentUser.contracts[0];
    state.currentDataset = state.currentUser.datasets[0];
    renderAll();
    autoSave();
  }

  document.documentElement.classList.remove('loading');
})();
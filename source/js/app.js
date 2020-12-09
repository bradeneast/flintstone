import auth from './auth';
import AcceptInvite from './components/AuthScreens/AcceptInvite';
import ResetPassword from './components/AuthScreens/ResetPassword';
import Modal from './components/Modal';
import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave, defaultState, updatePreferenceClasses } from './state';
import { tags } from './style_data';
import { ensureProps, serialize } from './utils';

state.loading = true;

if (!state.savedLocally) {

  defaultState
    .then(defaultState => {
      serialize(defaultState, state);
      state.currentDataset = state.currentUser.datasets[0];
      state.currentDocument = state.currentUser.documents[0];
      ensureProps(Object.keys(tags), state.styles);

      state.loading = false;
      renderAll();
      autoSave();
    })
}
else {

  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  state.savedLocally = state.savedLocally || false;
  state.showPreview = state.showPreview || false;
  state.showStyles = state.showStyles || false;
  state.styles = state.styles || {};
  state.expandedAdjustments = state.expandedAdjustments || ["global", "pages"];

  // Serialize user custom styles
  ensureProps(Object.keys(tags), state.styles);

  state.loading = false;
  updatePreferenceClasses();
  renderAll();
  autoSave();

  if (state.showPreview)
    renderPreview();
}


if (location.hash && location.hash.length) {

  let [key, value] = location.hash.slice(1).split('=');
  // remove fragment as much as it can go without adding an entry in browser history:
  location.replace("#");
  // slice off the remaining '#' in HTML5:    
  if (typeof history.replaceState == 'function') {
    history.replaceState({}, '', location.href.slice(0, -1));
  }

  // Confirm or recover user 
  switch (key) {
    case 'recovery_token':
      auth
        .recover(value, true)
        .then(() => renderAll(Modal(ResetPassword())));
      break;
    case 'confirmation_token':
      auth
        .confirm(value, true)
        .then(response => {
          console.log(response);
          renderAll();
        });
      break;
    case 'invite_token':
      renderAll(Modal(AcceptInvite(value)));
      break;
  }
}



console.log(auth.currentUser());
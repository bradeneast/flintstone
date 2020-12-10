import auth from './auth';
import AcceptInvite from './components/AuthScreens/AcceptInvite';
import ResetPassword from './components/AuthScreens/ResetPassword';
import Modal from './components/Modal';
import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave, defaultState, updatePreferenceClasses, identityState } from './state';
import { tags } from './style_data';
import { ensureProps, serialize } from './utils';


state.loading = true;

let completeLoading = () => {
  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  state.savedLocally = state.savedLocally || false;
  state.showPreview = state.showPreview || false;
  state.showStyles = state.showStyles || false;
  state.currentUser.styles = state.currentUser.styles || {};
  state.expandedAdjustments = state.expandedAdjustments || ["global", "pages"];
  ensureProps(Object.keys(tags), state.currentUser.styles);
  updatePreferenceClasses();
  state.loading = false;
  renderAll();
  autoSave();
  if (state.showPreview) renderPreview();
}

if (identityState)
  identityState
    .then(identityState => {
      serialize(identityState, state.currentUser);
      completeLoading();
    })
else if (state.savedLocally)
  completeLoading();
else
  defaultState
    .then(defaultState => {
      serialize(defaultState, state);
      completeLoading();
    })


if (location.hash && location.hash.length) {

  let [key, value] = location.hash.slice(1).split('=');

  // Remove hash fragment from url
  location.replace("#");
  if (typeof history.replaceState == 'function')
    history.replaceState({}, '', location.href.slice(0, -1));

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
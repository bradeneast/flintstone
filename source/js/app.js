import auth from './auth';
import AcceptInvite from './components/AuthScreens/AcceptInvite';
import AuthError from './components/AuthScreens/AuthError';
import ResetPassword from './components/AuthScreens/ResetPassword';
import Modal from './components/Modal';
import renderPreview from './functions/renderPreview';
import state, { renderAll, autoSave, defaultState, updatePreferenceClasses, identityState } from './state';
import { tags } from './style_data';
import { ensureProps, serialize } from './utils';


state.loading = true;

/** Provide default values for nonessential state properties and render */
let completeLoading = () => {
  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  state.savedLocally = state.savedLocally || false;
  state.showPreview = state.showPreview || false;
  state.showStyles = state.showStyles || false;
  state.expandedAdjustments = state.expandedAdjustments || ["global", "pages"];
  state.currentUser.styles = state.currentUser.styles || {};
  ensureProps(Object.keys(tags), state.currentUser.styles);
  updatePreferenceClasses();
  state.loading = false;
  renderAll();
  autoSave();
  if (state.showPreview) renderPreview();
}



// PICK WHICH STATE DATA TO USE //
if (identityState)
  identityState
    .then(identityState => {
      state.currentUser = JSON.parse(identityState.user_metadata.flintstone);
      completeLoading();
    })
    .catch(err => {
      console.log(err);
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
    .catch(err => {
      console.log(err);
      renderAll(Modal(AuthError()));
    })



// HANDLE ONE-TIME AUTH TOKENS //
if (location.hash && location.hash.length) {

  let [key, value] = location.hash.slice(1).split('=');
  location.replace("#");
  history.replaceState(null, null, location.href.slice(0, -1));

  if (key && value) {
    // Confirm or recover user 
    switch (key) {
      case 'recovery_token': auth.recover(value, true).then(() => renderAll(Modal(ResetPassword())));
        break;
      case 'confirmation_token': auth.confirm(value, true).then(() => renderAll());
        break;
      case 'invite_token': renderAll(Modal(AcceptInvite(value)));
        break;
    }
  }
}
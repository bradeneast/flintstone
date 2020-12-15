import auth from './auth';
import AcceptInvite from './components/AuthScreens/AcceptInvite';
import ResetPassword from './components/AuthScreens/ResetPassword';
import Modal from './components/Modal';
import Welcome from './components/Welcome';
import state, { renderAll, autoSave, identityState, prepState } from './state';


state.loading = true;

/** Provide default values for nonessential state properties and render */
let completeLoading = () => {

  prepState();

  // HANDLE ONE-TIME AUTH TOKENS //
  if (location.hash && location.hash.length) {

    let [key, value] = location.hash.slice(1).split('=');
    location.replace("#");
    history.replaceState(null, null, location.href.slice(0, -1));
    state.loading = false;

    if (key && value) {

      // Confirm or recover user
      switch (key) {
        case 'recovery_token': auth.recover(value, true).then(() =>
          renderAll(Modal(ResetPassword()))
        );
          break;
        case 'confirmation_token': auth.confirm(value, true).then(() => {
          renderAll();
          autoSave(true);
        });
          break;
        case 'invite_token': renderAll(Modal(AcceptInvite(value)));
          break;
      }
    }
  }

  else {
    state.loading = false;
    renderAll();
    autoSave(true);
  }
}




// PICK WHICH STATE DATA TO USE //

// Get state from Netlify Identity
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

// Get state from Local Storage
else if (state.savedLocally)
  completeLoading();

// Render welcome screen
else {
  state.loading = false;
  renderAll(Modal(Welcome()));
}
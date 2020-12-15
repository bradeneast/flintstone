import { html, render } from 'lit-html';
import { ensureProps, ls, toggleRootClass } from './utils';
import Main from './components/Main';
import Header from './components/Header';
import auth from './auth';
import { tags } from './style_data';


// Get local state and default state
let user = auth.currentUser();
let state = ls('flintstone_data') || {
  currentUser: {
    documents: [{ id: 'New Document', body: '' }],
    datasets: [{ id: 'New Dataset', fields: [['', '']] }],
    styles: {}
  }
};

let autoSaveWaiter = setTimeout(() => null, 0);



export default state;
export let identityState = user?.getUserData();
export let defaultState = fetch('/defaults.json').then(r => r.json());
export let preferences = ls('flintstone_preferences') || {
  dark: false,
  showStyles: false,
  showMenu: false
};


export function prepState() {
  state.currentDataset = state.currentUser.datasets[0];
  state.currentDocument = state.currentUser.documents[0];
  state.savedLocally = state.savedLocally || false;
  state.showPreview = state.showPreview || false;
  state.showStyles = state.showStyles || false;
  state.expandedAdjustments = state.expandedAdjustments || ["global", "pages"];
  state.currentUser.styles = state.currentUser.styles || {};
  ensureProps(Object.keys(tags), state.currentUser.styles);
  updatePreferenceClasses();
}



export function autoSave(immediate = false) {

  state.savedLocally = true;
  let waitAmount = 2000;
  let timeout = immediate ? 0 : waitAmount;

  clearTimeout(autoSaveWaiter);
  autoSaveWaiter = setTimeout(save, timeout);
  toggleRootClass('working', true);

  function save() {

    if (auth.currentUser())
      return auth
        .currentUser()
        .update({ data: { flintstone: JSON.stringify(state.currentUser) } })
        .then(() => {
          state.error = false;
          toggleRootClass('working', false);
        })
        .catch(err => {
          console.error(err);
          state.error = err.message;
          toggleRootClass('error', true);
        })

    try {
      state.error = false;
      ls('flintstone_data', state);
      toggleRootClass('working', false);
    }
    catch (err) {
      console.error(err);
      state.error = err.message;
      toggleRootClass('error', true);
    }
  }
}


/**Render the whole app */
export function renderAll(contents = Main()) {

  render(html`
  <div id=app ?data-loading=${state.loading}>
    <header>${Header()}</header>
    ${contents}
    <loader></loader>
    <status-message>
      ${state.error ? `Error: ${state.error}` : 'All changes saved'}
    </status-message>
  </div>`,
    document.body
  );
}


export function updatePreferenceClasses() {
  for (let [key, value] of Object.entries(preferences))
    toggleRootClass(key, value)
}


/**Acts like a proxy to set and save UI preferences */
export function setPreference(key, value) {
  preferences[key] = value;
  toggleRootClass(key, value);
  ls('flintstone_preferences', preferences);
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value, save) {
  state[key] = value;
  renderAll();
  if (save) autoSave();
}
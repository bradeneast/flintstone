import { html, render } from 'lit-html';
import { ls } from './utils';
import Main from './components/Main';
import Header from './components/Header';
import auth from './auth';


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
export let preferences = ls('flintstone_preferences') || { dark: false };



export function autoSave(immediate = false) {

  let timeout = immediate ? 0 : 2000;
  clearTimeout(autoSaveWaiter);
  autoSaveWaiter = setTimeout(save, timeout);

  function save() {

    if (auth.currentUser())
      return auth
        .currentUser()
        .update({
          data: { flintstone: JSON.stringify(state.currentUser) }
        })

    state.savedLocally = true;
    ls('flintstone_data', state);
  }
}


/**Render the whole app */
export function renderAll(contents = Main()) {
  render(html`
  <div id=app ?data-loading=${state.loading}>
    <header>${Header()}</header>
    ${contents}
    <loader></loader>
  </div>`,
    document.body
  );
}


export function updatePreferenceClasses() {
  for (let [key, value] of Object.entries(preferences))
    document.documentElement.classList.toggle(key, value);
}


/**Acts like a proxy to set and save UI preferences */
export function setPreference(key, value) {
  preferences[key] = value;
  ls('flintstone_preferences', preferences);
  updatePreferenceClasses();
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}
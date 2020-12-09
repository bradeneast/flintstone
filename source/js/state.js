import { html, render } from 'lit-html';
import auth from './auth';
import { ls } from './utils';
import Main from './components/Main';
import Header from './components/Header';


// Get local state and default state
let state = ls('flintstone_data') || {};

export default state;
export let defaultState = fetch('/defaults.json').then(r => r.json());
export let preferences = ls('flintstone_preferences') || { dark: false };


// Auto-save to local storage
let autoSaveWaiter = setTimeout(() => null, 0);

export async function autoSave() {
  clearTimeout(autoSaveWaiter);
  autoSaveWaiter = setTimeout(() => {
    ls('flintstone_data', state);
    state.savedLocally = true;
    auth?.currentUser()?.update({ flintstone_data: 'testing' });
  }, 1000);
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
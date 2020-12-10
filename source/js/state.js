import { html, render } from 'lit-html';
import { ls } from './utils';
import Main from './components/Main';
import Header from './components/Header';
import auth from './auth';


// Get local state and default state
let state = ls('flintstone_data') || {
  currentUser: {},
  styles: {},
  expandedAdjustments: [],
};

export default state;
export let defaultState = fetch('/defaults.json').then(r => r.json());
export let preferences = ls('flintstone_preferences') || { dark: false };


let autoSaveWaiter = setTimeout(() => null, 0);
export async function autoSave() {

  let user = auth.currentUser();
  state.savedLocally = true;

  async function save() {
    ls('flintstone_data', state);
    if (user)
      fetch('/.netlify/api/UpdateUser', { method: 'PUT', body: JSON.stringify(state.currentUser) })
        .then(() => console.log(auth.currentUser()))
  }

  clearTimeout(autoSaveWaiter);
  autoSaveWaiter = setTimeout(save, 2000);
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
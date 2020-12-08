import { html, render } from 'lit-html';
import auth from './auth';
import { $, ls } from './utils';
import Main from './components/Main';
import Header from './components/Header';


// Get local state and default state
let state = ls('flintstone') || {};

export default state;
export let defaultState = fetch('/defaults.json').then(r => r.json());


// Auto-save to local storage
let autoSaveWaiter = setTimeout(() => null, 0);

export async function autoSave() {
  clearTimeout(autoSaveWaiter);
  autoSaveWaiter = setTimeout(() => {
    ls('flintstone', state);
    state.savedLocally = true;
    auth?.currentUser()?.update(state.currentUser)
  }, 1000);
}


/**Render the whole app */
export function renderAll(contents = Main()) {
  render(
    html`
    <div id=app ?data-dark=${state.dark} ?data-loading=${state.loading}>
      <header>${Header()}</header>
      ${contents}
      <loader></loader>
    </div>`,
    document.body
  );
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}
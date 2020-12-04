import DocumentsPane from './components/DocumentsPane';
import DataPane from './components/DataPane';
import PreviewPane from './components/PreviewPane';
import { html, render } from './lit-html/lit-html';
import { $, ls } from './utils';
import Header from './components/Header';
import StylesPane from './components/StylesPane';


// Get local state and default state
let state = ls('contractly_user') || {};

export default state;
export let defaultState = fetch('/defaults.json').then(r => r.json());


/**Auto-save to local storage */
let autoSaveWaiter = setTimeout(() => null, 0);
export function autoSave() {

  clearTimeout(autoSaveWaiter);

  autoSaveWaiter = setTimeout(() => {
    state.savedLocally = true;
    ls('contractly_user', state);
  }, 1000);

}


/**Render the whole app */
export function renderAll() {
  render(Header(), $('header'));
  render(DocumentsPane(), $('section.left'));
  render(PreviewPane(), $('section.center'));
  render(html`${DataPane()}${StylesPane()}`, $('section.right'));
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}
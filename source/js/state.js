import DocumentsPane from './components/DocumentsPane';
import DataPane from './components/DataPane';
import PreviewPane from './components/PreviewPane';
import { html, render } from './lit-html/lit-html';
import { $, ls } from './utils';
import Header from './components/Header';
import StylesPane from './components/StylesPane';


// Default state
let state = ls('contractly_user') || {};
let autoSaveWaiter = setTimeout(() => null, 0);

/**Auto-save to local storage */
export function autoSave() {

  clearTimeout(autoSaveWaiter);

  autoSaveWaiter = setTimeout(() => {
    state.savedLocally = true;
    ls('contractly_user', state);
  }, 1000);

}


/**Render the whole app */
export function renderAll() {
  render(DocumentsPane(), $('section.left'));
  render(PreviewPane(), $('section.center'));
  render(html`${DataPane()}${StylesPane()}`, $('section.right'));
  render(Header(), $('header'));
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}


export default state;
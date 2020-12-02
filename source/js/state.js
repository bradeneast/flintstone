import DocumentsPane from './components/DocumentsPane';
import DataPane from './components/DataPane';
import PreviewPane from './components/PreviewPane';
import { render } from './lit-html/lit-html';
import { $, ls } from './utils';
import Header from './components/Header';


// Default state
let state = ls('contractly_user') || {
  savedLocally: false, // Saved locally
  showPreview: false, // Preview pane is shown
  dark: false, // Dark mode
  currentDocument: null,
  currentDataset: null,
  currentUser: {
    documents: [
      {
        id: '',
        body: ''
      }
    ],
    datasets: [
      {
        id: '',
        fields: []
      }
    ]
  },
}


let waiter = setTimeout(() => null, 1000);
/**Auto-save to local storage */
export function autoSave() {
  clearTimeout(waiter);
  waiter = setTimeout(() => {
    state.savedLocally = true;
    ls('contractly_user', state);
  }, 1000);
}


/**Render the whole app */
export function renderAll() {
  render(DocumentsPane(), $('.left-pane'));
  render(PreviewPane(), $('.center-pane'));
  render(DataPane(), $('.right-pane'));
  render(Header(), $('header'));
}


/**Acts like a proxy to render and save when a stateful value is changed */
export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}


export default state;
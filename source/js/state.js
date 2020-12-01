import DocumentsPane from './components/DocumentsPane';
import DataPane from './components/DataPane';
import PreviewPane from './components/PreviewPane';
import { render } from './lit-html/lit-html';
import { $, ls } from './utils';
import Header from './components/Header';


let waiter = setTimeout(() => null, 1000);

let state = ls('contractly_user') || {
  savedLocally: false,
  showPreview: false,
  dark: false,
  currentDocument: null,
  currentDataset: null,
  currentUser: {
    documents: [],
    datasets: [
      {
        id: '',
        fields: []
      }
    ]
  },
}

/**Auto-save to local storage */
export function autoSave() {
  clearTimeout(waiter);
  waiter = setTimeout(() => {
    state.savedLocally = true;
    ls('contractly_user', state);
  }, 1000);
}

export function renderAll() {
  render(DocumentsPane(), $('.left-pane'));
  render(PreviewPane(), $('.center-pane'));
  render(DataPane(), $('.right-pane'));
  render(Header(), $('header'));
}

export function setState(key, value) {
  state[key] = value;
  // console.log(state.currentDataset);
  renderAll();
  autoSave();
}

export let findDocumentByID = (id) => state.currentUser.documents.find(c => c.id == id);
export let findDatasetByID = (id) => state.currentUser.datasets.find(d => d.id == id);
export default state;
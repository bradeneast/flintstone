import ContractsPane from './components/ContractsPane';
import DataPane from './components/DataPane';
import PreviewPane from './components/PreviewPane';
import { render } from './lit-html/lit-html';
import { $, ls } from './utils';


let waiter = setTimeout(() => null, 1000);

let state = ls('contractly_user') || {
  savedLocally: false,
  showPreview: false,
  currentContract: {},
  currentUser: {
    contracts: [],
    datasets: []
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
  render(ContractsPane(), $('#left-pane'));
  render(PreviewPane(), $('#center-pane'));
  render(DataPane(), $('#right-pane'));
}

export function setState(key, value) {
  state[key] = value;
  renderAll();
  autoSave();
}

export let findContractByID = (id) => state.currentUser.contracts.find(c => c.id == id);
export let findDatasetByID = (id) => state.currentUser.datasets.find(d => d.id == id);
export default state;
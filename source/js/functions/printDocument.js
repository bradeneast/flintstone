import state, { renderAll, setState } from "../state";

export default () => {
  state.loading = true;
  state.showPreview = true;
  renderAll();
  setTimeout(() => { print(); setState('loading', false) }, 500)
}
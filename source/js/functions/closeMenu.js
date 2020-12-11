import state, { renderAll } from "../state"

export default () => {
  let wasShown = state.showMenu;
  state.showMenu = false;
  if (wasShown) renderAll();
}
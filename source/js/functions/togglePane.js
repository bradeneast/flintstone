import { renderAll, setPreference } from "../state";

export default (pane, force) => {
  force || force == undefined
    ? setPreference('open_pane', pane)
    : setPreference('open_pane', undefined);
  renderAll();
}
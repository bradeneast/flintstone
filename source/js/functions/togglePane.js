import { preferences, renderAll, setPreference } from "../state";

export default (pane, force) => {

  if (force == undefined)
    pane == preferences.open_pane
      ? setPreference('open_pane', undefined)
      : setPreference('open_pane', pane);

  else
    force
      ? setPreference('open_pane', pane)
      : setPreference('open_pane', undefined);

  renderAll();
}
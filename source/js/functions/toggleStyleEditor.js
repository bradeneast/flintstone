import { preferences, renderAll, setPreference } from "../state";

export default (force) => {
  if (force == undefined) {
    setPreference('showStyles', !preferences.showStyles);
    renderAll();
  }
  else {
    setPreference('showStyles', force);
    renderAll();
  }
}
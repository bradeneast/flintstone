import applyFormatting from "./functions/applyFormatting";
import { preferences, renderAll, setPreference } from "./state";

const shortcuts = {
  "b": () => applyFormatting('**', '**'),
  "i": () => applyFormatting('_', '_'),
  "`": () => applyFormatting('`', '`'),
  "Delete": () => applyFormatting('~', '~'),
  "Z": () => {
    setPreference('zen', !preferences.zen);
    renderAll();
  }
}

export default shortcuts;
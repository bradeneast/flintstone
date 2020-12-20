import state from "../state";
import { sanitizeCSS } from "../utils";
import { dataMatcher, hydrateFromDataset } from "../components/Documents/DocumentPreview";

let makeStyleRule = ([propName, propValue]) => {
  if (/content|font-family/i.test(propName)) {
    if (propValue.length)
      propValue = '"' + propValue.replace(/"/g, '\\"') + '"';
    else return;
  }
  propValue = propValue.replace(dataMatcher, hydrateFromDataset);
  return [propName, sanitizeCSS(propValue)].join(':')
}


/**Generate preview styles based on user settings or defaults */
export default () => `
<style>
${Object
    .entries(state.currentUser.styles)
    .map(([tagName, prop]) =>
      `.preview ${tagName} {
        ${Object.entries(prop).map(makeStyleRule).join(';')}
      }`)
    .join('')
  }
</style>`;
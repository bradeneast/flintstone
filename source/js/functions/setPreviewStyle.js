import state, { setState } from "../state"

export default (tagName, propName, propValue) => {
  state.styles[tagName][propName] = propValue;
  setState('styles', state.styles);
}
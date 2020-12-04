import state, { defaultState, setState } from "../state"
import { deepCopy } from "../utils";

export default (tagName) => {
  defaultState
    .then(defaultState => {
      state.styles[tagName] = deepCopy(defaultState.styles[tagName]);
      setState('styles', state.styles);
    })
}
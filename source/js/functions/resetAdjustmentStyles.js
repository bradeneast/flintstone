import state, { defaultState, setState } from "../state"
import { deepCopy } from "../utils";

export default (tagName) => {
  defaultState
    .then(defaultState => {
      state.currentUser.styles[tagName] = deepCopy(defaultState.currentUser.styles[tagName]);
      setState('currentUser', state.currentUser, true);
    })
}
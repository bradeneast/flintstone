import state, { defaultState, setState } from "../state"
import { tags } from "../style_data";
import { deepCopy } from "../utils";

export default (tagName) => {
  defaultState
    .then(defaultState => {
      let styles = state.currentUser.styles;
      styles[tagName] = deepCopy(defaultState.currentUser.styles[tagName]);
      state.expandedAdjustments.push(tags[tagName].normieName);
      setState('currentUser', state.currentUser, true);
    })
}
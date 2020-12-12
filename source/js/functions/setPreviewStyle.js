import state, { setState } from "../state";

export default (tagName, propName, propValue) => {
  state.currentUser.styles[tagName][propName] = propValue;
  setState('currentUser', state.currentUser, true);
}
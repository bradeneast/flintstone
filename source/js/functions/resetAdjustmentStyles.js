import state, { defaultState, setState } from "../state"

export default (tagName) => {
  defaultState
    .then(defaultState => {
      state.styles[tagName] = defaultState.styles[tagName];
      setState('styles', state.styles);
    })
}
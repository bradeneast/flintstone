import state, { setState } from "../state"

export default () => {
  document.documentElement.classList.toggle('dark', !state.dark);
  setState('dark', !state.dark);
}
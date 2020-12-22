import { html } from "lit-html";
import state, { autoSave, defaultState, handleError, prepState, renderAll } from "../state";
import { serialize } from "../utils";
import AuthError from "./AuthScreens/AuthError";
import Button from "./Button";
import Modal from "./Modal";


export default () => html`
<div>
  <h1 class=mount>Welcome to <span style="color: var(--primary)">Flintstone</span>!</h1>
  <p>The tool for creating formal-ish documents on the go.</p>
</div>
<form class="mount">
${
  Button({
    content: 'Start from scratch',
    className: 'primary',
    action: () => defaultState
      .then(defaultState => {
        state.savedLocally = true;
        state.currentUser.styles = defaultState.currentUser.styles;
        prepState();
        renderAll();
        autoSave(true);
        console.log(state.currentUser.styles);
    })
  })
}
${
  Button({
    content: 'Use the starter template',
    className: 'link',
    action: () => defaultState
      .then(defaultState => {
        serialize(defaultState, state);
        state.savedLocally = true;
        prepState();
        renderAll();
        autoSave(true);
      })
      .catch(err => {
        handleError(err);
        renderAll(Modal(AuthError(err.message)));
      })
  })
}
</form>`;
import { html } from "lit-html";
import state, { autoSave, defaultState, prepState, renderAll } from "../state";
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
    action: () => {
      state.savedLocally = true;
      state.loading = false;
      prepState();
      renderAll();
      autoSave(true);
    }
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
        state.loading = false;
        prepState();
        renderAll();
        autoSave(true);
      })
      .catch(err => {
        console.log(err);
        state.error = err.message;
        renderAll(Modal(AuthError(err.message)));
      })
  })
}
</form>`;
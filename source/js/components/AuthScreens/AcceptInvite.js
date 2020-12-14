import { html } from "lit-html";
import auth from "../../auth";
import state, { autoSave, setState } from "../../state";
import Button from "../Button";
import Inputs from "./Inputs";

export default (token) => {

  let fields = ['name', 'password'];
  let formData = {};

  return html`
  <form class=mount>
    ${Inputs({ fields, formData })}
    ${
      Button({
        className: 'primary',
        content: 'Create Account & Sign In',
        action: () => {
          setState('loading', true);
          auth
            .acceptInvite(token, formData.password, true)
            .then(response => console.log(response))
            .then(() => {
              auth.currentUser().update({ full_name: formData.name });
              autoSave(true);
            })
            .then(response => {
              console.log(response);
              setState('loading', false);
            })
            .catch(err => {
              console.log(err);
              state.error = err.message;
              setState('loading', false);
              renderAll(Modal(AuthError(err.message)));
            })
        }
      })
    }
  </form>`;
}
import { html } from "lit-html";
import auth from "../../auth";
import { handleError, setState } from "../../state";
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
            .then(() => {
              auth.currentUser().update({ full_name: formData.name });
              setState('loading', false);
            })
            .catch(err => {
              handleError(err);
              renderAll(Modal(AuthError(err.message)));
            })
        }
      })
    }
  </form>`;
}
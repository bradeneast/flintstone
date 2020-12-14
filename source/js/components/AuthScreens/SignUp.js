import { html } from "lit-html";
import auth from "../../auth";
import Button from "../Button";
import state, { renderAll, setState } from "../../state";
import Modal from "../Modal";
import AuthError from "./AuthError";
import Inputs from "./Inputs";


export default () => {

  let fields = ['name', 'email', 'password'];
  let formData = {};

  return html`
  <form>
    ${Inputs({ fields, formData })}
    ${
      Button({
        className: 'primary',
        content: 'Create Account',
        action: () => {
          setState('loading', true);
          auth
            .signup(formData.email, formData.password, { full_name: formData.name })
            .then(() => {
              setState('loading', false);
              renderAll(Modal('Confirmation email sent. Check your inbox.'));
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
    ${
      Button({
        className: 'link',
        content: 'Continue using anonymously',
        action: () => renderAll()
      })
    }
  </form>`;
}
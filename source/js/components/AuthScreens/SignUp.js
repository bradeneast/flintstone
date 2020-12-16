import { html } from "lit-html";
import auth from "../../auth";
import Button from "../Button";
import state, { handleError, renderAll, setState } from "../../state";
import Modal from "../Modal";
import AuthError from "./AuthError";
import Inputs from "./Inputs";
import Welcome from "../Welcome";


export default () => {

  let fields = ['name', 'email', 'password'];
  let formData = {};

  return html`
  <form class=mount>
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
              handleError(err);
              renderAll(Modal(AuthError(err.message)));
            })
        }
      })
    }
    ${
      Button({
        className: 'link',
        content: 'Continue using anonymously',
        action: () => state.savedLocally
        ? renderAll()
        : renderAll(Modal(Welcome()))
      })
    }
  </form>`;
}
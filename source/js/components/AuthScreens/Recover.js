import { html } from "lit-html";
import auth from "../../auth";
import { renderAll, setState } from "../../state";
import Button from "../Button";
import SignIn from "./SignIn";
import Modal from "../Modal";
import AuthError from "./AuthError";
import Inputs from "./Inputs";

export default () => {

  let fields = ['email'];
  let formData = {};

  return html`
  <form>
    ${Inputs({ fields, formData })}
    ${
      Button({
        className: 'primary',
        content: 'Send Recovery Email',
        action: () => {
          setState('loading', true);
          auth
            .requestPasswordRecovery(formData.email)
            .then(() => {
              setState('loading', false);
              renderAll(Modal('Recovery email sent. Check your inbox.'));
            })
            .catch(err => {
              console.log(err);
              state.error = err.message;
              setState('loading', false);
              renderAll(Modal(AuthError(err.message)))
            })
        }
      })
    }
    ${
      Button({
        className: 'link',
        content: 'Back to sign in',
        action: () => renderAll(Modal(SignIn()))
      })
    }
  </form>`;
}
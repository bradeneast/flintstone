import { html } from "lit-html";
import auth from "../../auth";
import { renderAll, setState } from "../../state";
import Button from "../Button";
import SignIn from "./SignIn";
import Modal from "../Modal";
import AuthError from "./AuthError";

export default () => {

  let email;

  return html`
  <div class=form>
    <label>
      Email
      <input @input=${e=> email = e.target.value} type=email name=email />
    </label>
    ${
      Button({
        className: 'primary',
        content: 'Send Recovery Email',
        action: () => {
          setState('loading', true);
          auth
            .requestPasswordRecovery(email)
            .then(() => {
              setState('loading', false);
              renderAll(Modal('Recovery email sent. Check your inbox.'));
            })
            .catch(err => {
              console.log(err);
              setState('loading', false);
              renderAll(Modal(AuthError()))
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
  </div>`;
}
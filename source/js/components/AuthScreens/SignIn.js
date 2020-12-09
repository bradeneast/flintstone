import { html } from "lit-html";
import auth from "../../auth";
import { renderAll, setState } from "../../state";
import Button from "../Button";
import Recover from "./Recover";
import Modal from "../Modal";
import AuthError from "./AuthError";


export default function Login() {

  let email;
  let password;

  return html`
  <div class=form>
    <label>
      Email
      <input @input=${e => email = e.target.value} type=email name=email />
    </label>
    <label>
      Password
      <input @input=${e => password = e.target.value} minlength=8 type=password name=password />
      ${
        Button({
          className: 'link',
          content: 'Forgot Password',
          action: () => renderAll(Modal(Recover()))
        })
      }
    </label>

    ${
      Button({
        className: 'primary',
        content: 'Sign In',
        action: () => {
          setState('loading', true);
          auth
            .login(email, password, true)
            .then(response => {
              console.log(response);
              setState('loading', false);
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
        content: 'Continue using anonymously',
        action: () => renderAll()
      })
    }
  </div>`;
}
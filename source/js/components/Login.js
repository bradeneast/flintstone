import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { renderAll, setState } from "../state";
import Recover from "./Recover";
import Modal from "./Modal";


export default () => {

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
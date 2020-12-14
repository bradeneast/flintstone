import { html } from "lit-html";
import auth from "../../auth";
import state, { autoSave, renderAll, setState } from "../../state";
import Button from "../Button";
import Recover from "./Recover";
import Modal from "../Modal";
import AuthError from "./AuthError";
import { handleFormInput } from "../../utils";


export default function Login() {

  let formData = {};

  return html`
  <form class=mount>
    <label>
      Email
      <input required @input=${event => handleFormInput(event, formData)} type=email name=email />
    </label>
    <label>
      Password
      <input required @input=${event => handleFormInput(event, formData)} type=password name=password />
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
            .login(formData.email, formData.password, true)
            .then(() => {
              autoSave(true);
              location = location.href;
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
        content: 'Continue using anonymously',
        action: () => renderAll()
      })
    }
  </form>`;
}
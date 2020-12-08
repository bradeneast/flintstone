import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { renderAll, setState } from "../state";

export default () => {

  let email;
  let password;

  return html`
  <modal class="mount-children">
    <div class=form>
      <label>
        Email
        <input @input=${e => email = e.target.value} type=email name=email />
      </label>
      <label>
        Password
        <input @input=${e => password = e.target.value} minlength=8 type=password name=password />
      </label>

      ${Button({
          className: 'primary',
          content: 'Sign In',
          action: () => {
            setState('loading', true);
            auth
            .login(email, password, true)
            .then(() => setState('loading', false))
          }
        })
      }
      ${Button({
          className: 'link',
          content: 'Continue using local storage',
          action: () => renderAll()
        })
      }
    </div>
  </modal>`;
}
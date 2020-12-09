import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { setState } from "../state";

export default () => {

  let password;

  return html`
  <div class=form>
    <label>
      New Password
      <input @input=${e => password = e.target.value} minlength=8 type=password name=password />
    </label>
    ${
      Button({
        className: 'primary',
        content: 'Save New Password',
        action: () => {
          setState('loading', true);
          auth
          .currentUser()
          .update({ password: password })
            .then(response => {
              console.log(response);
              setState('loading', false)
            })
        }
      })
    }
  </div>`;
}
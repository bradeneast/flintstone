import { html } from "lit-html";
import auth from "../../auth";
import { setState } from "../../state";
import Button from "../Button";

export default () => {

  let password;

  return html`
  <form>
    <label>
      New Password
      <input required @input=${e => password = e.target.value} minlength=8 type=password name=password />
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
              setState('loading', false);
              autoSave(true);
            })
        }
      })
    }
  </form>`;
}
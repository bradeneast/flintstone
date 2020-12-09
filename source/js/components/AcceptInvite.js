import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { setState } from "../state";

export default (token) => {

  let password;
  let full_name;

  return html`
  <div class=form>
    <label>
      Name
      <input @input=${e => full_name = e.target.value} minlength=8 type=text name=full_name />
    </label>
    <label>
      Password
      <input @input=${e => password = e.target.value} minlength=8 type=password name=password />
    </label>
    ${
      Button({
        className: 'primary',
        content: 'Create Account & Sign In',
        action: () => {
          setState('loading', true);
          auth
            .acceptInvite(token, password, true)
            .then(response => console.log(response))
            .then(() => auth.currentUser().update({full_name: full_name}))
            .then(response => {
              console.log(response);
              setState('loading', false);
              location.hash = '';
            })
        }
      })
    }
  </div>`;
}
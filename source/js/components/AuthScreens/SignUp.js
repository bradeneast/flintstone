import { html } from "lit-html";
import auth from "../../auth";
import Button from "../Button";
import { renderAll, setState } from "../../state";


export default () => {

  let full_name;
  let email;
  let password;

  return html`
  <div class=form>
    <label>
      Name
      <input @input=${e=> full_name = e.target.value} type=text name=full_name />
    </label>
    <label>
      Email
      <input @input=${e => email = e.target.value} type=email name=email />
    </label>
    <label>
      Password
      <input @input=${e => password = e.target.value} minlength=8 type=password name=password />
    </label>

    ${
      Button({
        className: 'primary',
        content: 'Create Account',
        action: () => {
          setState('loading', true);
          auth
            .signup(email, password, { full_name: full_name })
            .then(() => {
              setState('loading', false);
              renderAll(Modal('Confirmation email sent. Check your inbox.'));
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
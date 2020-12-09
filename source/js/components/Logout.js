import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { renderAll, setState } from "../state";

export default () => {

  let user = auth.currentUser();

  return html`
  <div class=form>
    ${
      Button({
        className: 'primary',
        content: 'Sign Out',
        action: () => {
          setState('loading', true);
          auth
            .currentUser()
            .logout()
            .then(() => setState('loading', false));
        }
      })
    }
    ${
      Button({
        className: 'link',
        content: html`Continue as <strong>${user.user_metadata.full_name || user.email}</strong>`,
        action: () => renderAll()
      })
    }
  </div>`;
}
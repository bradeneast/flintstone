import { html } from "lit-html";
import auth from "../../auth";
import Button from "../Button";
import { renderAll, setState } from "../../state";

export default () => {

  let user = auth.currentUser();

  return html`
  <form class=mount>
    ${
      Button({
        className: 'primary',
        content: 'Sign Out',
        action: () => {
          setState('loading', true);
          auth
            .currentUser()
            .logout()
            .then(() => location = location.href);
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
  </form>`;
}
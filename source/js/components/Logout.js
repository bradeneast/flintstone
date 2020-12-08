import auth from "../auth";
import { html } from "lit-html";
import Button from "./Button";
import { renderAll, setState } from "../state";

export default () => html`
<modal class="mount-children">
  <div class=form>
    ${Button({
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
    ${Button({
        className: 'link',
        content: html`Continue as <strong>${auth.currentUser().email}</strong>`,
        action: () => renderAll()
      })
    }
  </div>
</modal>`;
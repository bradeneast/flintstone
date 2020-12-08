import auth from "../auth";
import { html } from "lit-html";
import state, { renderAll, setState } from "../state";
import Button from "./Button";
import Login from './Login';
import Logout from "./Logout";


export default () => {

  let user = auth.currentUser();

  return html`
  <div id=logo>
    <img alt="Flintstone logo" src="logo${state.dark ? '-white' : ''}.svg" />
  </div>
  <nav>
    ${
      Button({
        title: `${state.showStyles ? 'Close' : 'Open'} style editor`,
        content: '✨',
        className: 'icon',
        action: () => setState('showStyles', !state.showStyles)
      })
    }
    ${
      Button({
        title: "Print the current document",
        className: 'icon',
        content: '🖨️',
        action: () => {
          state.loading = true;
          setState('showPreview', true);
          setTimeout(() => {
            print();
            setState('loading', false);
          }, 500)
        }
      })
    }
    ${
      Button({
        title: `Switch to ${state.dark ? 'light' : 'dark'} theme`,
        content: state.dark ? "🌝" : "🌞",
        className: 'icon',
        action: () => setState('dark', !state.dark)
      })
    }
    <separator></separator>
    ${
      Button({
        className: 'link',
        content: user ? html`Logged in as <strong>${user.email}</strong>` : 'Log in',
        action: user ? () => renderAll(Logout()) : () => renderAll(Login())
      })
    }
  </nav>`;
}
import auth from "../auth";
import { html, nothing } from "lit-html";
import state, { preferences, renderAll, setPreference, setState } from "../state";
import Button from "./Button";
import SignIn from './AuthScreens/SignIn';
import SignOut from "./AuthScreens/SignOut";
import Modal from "./Modal";
import SignUp from "./AuthScreens/SignUp";


export default () => {

  let user = auth.currentUser();

  return html`
  <div id=logo>
    <img class=show-light alt="Flintstone logo" src="logo.svg" />
    <img class=show-dark alt="Flintstone logo" src="logo-white.svg" />
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
        title: `Switch to ${preferences.dark ? 'light' : 'dark'} theme`,
        content: preferences.dark ? "🌝" : "🌞",
        className: 'icon',
        action: () => setPreference('dark', !preferences.dark)
      })
    }
    <separator></separator>
    ${
      user
      ? nothing
      : Button({
        className: 'primary',
        content: 'Sign up',
        action: () => renderAll(Modal(SignUp()))
      })
    }
    ${
      Button({
        className: 'link',
        content: user ? html`Signed in as <strong>${user.user_metadata.full_name || user.email}</strong>` : 'Sign in',
        action: user ? () => renderAll(Modal(SignOut())) : () => renderAll(Modal(SignIn()))
      })
    }
  </nav>`;
}
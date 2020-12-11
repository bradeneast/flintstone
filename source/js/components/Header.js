import auth from "../auth";
import { html, nothing, svg } from "lit-html";
import state, { preferences, renderAll, setPreference, setState } from "../state";
import Button from "./Button";
import SignIn from './AuthScreens/SignIn';
import SignOut from "./AuthScreens/SignOut";
import Modal from "./Modal";
import SignUp from "./AuthScreens/SignUp";
import Icon from "./Icon";


export default () => {

  let user = auth.currentUser();

  return html`
  <div id=logo>
    <light>
      <img alt="Flintstone logo" src="logo.svg" />
    </light>
    <dark>
      <img alt="Flintstone logo" src="logo-white.svg" />
    </dark>
  </div>
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
  <separator></separator>
  ${
    Button({
      title: `${state.showMenu ? 'Close' : 'Open'} menu`,
      content: Icon({
        content: svg`
        <line y1="10" x2="100%" y2="10"/>
        <line y1="50%" x2="100%" y2="50%"/>
        <line y1="206" x2="100%" y2="206"/>`
      }),
      className: 'icon menu-toggle',
      action: () => setState('showMenu', !state.showMenu)
    })
  }
  <nav ?data-open=${state.showMenu}>
    ${
      Button({
        className: 'icon',
        content: `✨ ${ state.showStyles ? 'Close' : 'Open' } style editor`,
        action: () => setState('showStyles', !state.showStyles)
      })
    }
    ${
      Button({
        className: 'icon',
        content: '🖨️ Print current document',
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
        className: 'icon',
        content: html`<light>🌞</light><dark>🌝</dark> Switch to <light>dark</light><dark>light</dark> theme`,
        action: () => setPreference('dark', !preferences.dark)
      })
    }
  </nav>`;
}
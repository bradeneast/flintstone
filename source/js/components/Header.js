import auth from "../auth";
import { html, nothing, svg } from "lit-html";
import state, { preferences, renderAll, setPreference } from "../state";
import Button from "./Button";
import SignIn from './AuthScreens/SignIn';
import SignOut from "./AuthScreens/SignOut";
import Modal from "./Modal";
import SignUp from "./AuthScreens/SignUp";
import Icon from "./Icon";
import toggleMenu from "../functions/toggleMenu";
import toggleStyleEditor from "../functions/toggleStyleEditor";
import printDocument from "../functions/printDocument";


export default () => {

  let user = auth.currentUser();

  return html`
  <div id=logo>
    <light>
      <desktop-only>
        <img alt="Flintstone logo" src="logo.svg" />
      </desktop-only>
      <mobile-only>
        <img alt="Flintstone logo" src="logo-icon.svg" />
      </mobile-only>
    </light>
    <dark>
      <desktop-only>
        <img alt="Flintstone logo" src="logo-light.svg" />
      </desktop-only>
      <mobile-only>
        <img alt="Flintstone logo" src="logo-icon-light.svg" />
      </mobile-only>
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
  ${state.savedLocally ? html`<separator></separator>` : nothing}
  ${
    state.savedLocally
      ? Button({
          title: `${state.showMenu ? 'Close' : 'Open'} menu`,
          content: Icon({
            content: svg`
            <line y1="30" x2="100%" y2="30"/>
            <line y1="50%" x2="100%" y2="50%"/>
            <line y1="186" x2="100%" y2="186"/>`
          }),
          className: 'icon menu-toggle',
          action: () => toggleMenu()
        })
      : nothing
  }
  <nav>
    ${
      Button({
        className: 'icon',
        content: `✨ ${ preferences.showStyles ? 'Close' : 'Open' } style editor`,
        action: () => {
          toggleMenu(false);
          toggleStyleEditor();
        }
      })
    }
    ${
      Button({
        className: 'icon',
        content: '🖨️ Print current document',
        action: printDocument
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
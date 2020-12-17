import auth from "../../auth";
import { html, nothing, svg } from "lit-html";
import state, { renderAll } from "../../state";
import Button from "../Button";
import SignIn from '../AuthScreens/SignIn';
import SignOut from "../AuthScreens/SignOut";
import Modal from "../Modal";
import SignUp from "../AuthScreens/SignUp";
import Icon from "../Icon";
import toggleMenu from "../../functions/toggleMenu";
import Nav from "./Nav";
import Logo from "./Logo";


export default () => {

  let user = auth.currentUser();

  return html`
  ${Logo()}
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
  ${Nav()}`;
}
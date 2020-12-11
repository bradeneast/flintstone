import { render } from "lit-html";
import Header from "../components/Header";
import state from "../state"
import { $, toggleRootClass } from "../utils";

export default (force) => {
  if (force == undefined) {
    toggleRootClass('show-menu', !state.showMenu);
    state.showMenu = !state.showMenu;
    render(Header(), $('header'));
  }
  else {
    toggleRootClass('show-menu', force);
    state.showMenu = force;
    render(Header(), $('header'));
  }
}
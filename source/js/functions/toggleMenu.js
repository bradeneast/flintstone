import { render } from "lit-html";
import Header from "../components/Header";
import { preferences, setPreference } from "../state"
import { $ } from "../utils";

export default (force) => {
  if (force == undefined) {
    setPreference('showMenu', !preferences.showMenu);
    render(Header(), $('header'));
  }
  else {
    setPreference('showMenu', force);
    render(Header(), $('header'));
  }
}
import { render } from "lit-html";
import Header from "../components/Header/Header";
import { preferences, setPreference } from "../state"
import { $ } from "../utils";


export default (force) => {
  if (force == undefined) {
    setPreference('show_header_nav', !preferences.show_header_nav);
    render(Header(), $('header'));
  }
  else {
    setPreference('show_header_nav', force);
    render(Header(), $('header'));
  }
}
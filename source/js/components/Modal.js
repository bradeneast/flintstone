import { html } from "lit-html";
import toggleMenu from "../functions/toggleMenu";

export default (component) => html`<modal @click=${() => toggleMenu(false)} class=>${component}</modal>`;
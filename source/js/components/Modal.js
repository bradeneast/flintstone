import { html } from "lit-html";

export default (component) => html`<modal class=mount-children>${component}</modal>`;
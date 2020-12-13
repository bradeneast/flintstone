import { html } from 'lit-html';
import toggleMenu from '../functions/toggleMenu';
import toggleStyleEditor from '../functions/toggleStyleEditor';
import DataPane from './DataPane';
import DocumentsPane from './DocumentsPane';
import PreviewPane from './PreviewPane';
import StylesPane from './StylesPane';


export default () => html`
<main @click=${()=> toggleMenu(false)}>
  <section @click=${() => toggleStyleEditor(false)} class="aside left">${DocumentsPane()}</section>
  <section @click=${() => toggleStyleEditor(false)} class="center">${PreviewPane()}</section>
  <section class="aside right">
    ${DataPane()}
    ${StylesPane()}
  </section>
</main>`;
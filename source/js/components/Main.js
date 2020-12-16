import { html } from 'lit-html';
import toggleMenu from '../functions/toggleMenu';
import toggleStyleEditor from '../functions/toggleStyleEditor';
import DataPane from './Datasets/DataPane';
import DocumentsPane from './Documents/DocumentsPane';
import PreviewPane from './PreviewPane';
import StylesPane from './Styles/StylesPane';


export default () => html`
<main @click=${() => toggleMenu(false)}>
  <section @click=${()=> toggleStyleEditor(false)} class="aside left">${DocumentsPane()}</section>
  <section @click=${()=> toggleStyleEditor(false)} class="center">${PreviewPane()}</section>
  <section class="aside right">
    ${DataPane()}
    ${StylesPane()}
  </section>
</main>`;
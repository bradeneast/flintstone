import { html } from 'lit-html';
import closeMenu from '../functions/closeMenu';
import DataPane from './DataPane';
import DocumentsPane from './DocumentsPane';
import PreviewPane from './PreviewPane';
import StylesPane from './StylesPane';


export default () => html`
<main @click=${closeMenu}>
  <section class="aside left">${DocumentsPane()}</section>
  <section class="center">${PreviewPane()}</section>
  <section class="aside right">
    ${DataPane()}
    ${StylesPane()}
  </section>
</main>`;
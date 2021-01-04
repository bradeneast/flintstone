import { html } from 'lit-html';
import toggleMenu from '../functions/toggleMenu';
import togglePane from '../functions/togglePane';
import { preferences, renderAll } from '../state';
import DataPane from './Datasets/DataPane';
import ImportDialogue from './Dialogues/ImportDialogue';
import DocumentsPane from './Documents/DocumentsPane';
import Modal from './Modal';
import CenterPane from './CenterPane';
import StylesPane from './Styles/StylesPane';


export default () => html`
<main 
?data-zen=${preferences.zen}
@click=${() => toggleMenu(false)}
@dragleave=${renderAll}
@dragenter=${() => 
  renderAll(Modal(ImportDialogue()))
}
@dragover=${event => event.preventDefault()}>
  <section class="aside left">${DocumentsPane()}</section>
  <section @click=${() => togglePane('styles', false)} class="center">${CenterPane()}</section>
  <section class="aside right">${DataPane()}</section>
  ${StylesPane()}
</main>`;
import { html } from 'lit-html';
import toggleMenu from '../functions/toggleMenu';
import toggleStyleEditor from '../functions/toggleStyleEditor';
import { renderAll } from '../state';
import DataPane from './Datasets/DataPane';
import ImportDialogue from './Dialogues/ImportDialogue';
import DocumentsPane from './Documents/DocumentsPane';
import Modal from './Modal';
import PreviewPane from './PreviewPane';
import StylesPane from './Styles/StylesPane';


export default () => html`
<main
@click=${() => toggleMenu(false)} 
@dragleave=${renderAll} 
@dragenter=${() => 
  renderAll(Modal(ImportDialogue()))
}
@dragover=${event => event.preventDefault()}>
  <section @click=${()=> toggleStyleEditor(false)} class="aside left">${DocumentsPane()}</section>
  <section @click=${()=> toggleStyleEditor(false)} class="center">${PreviewPane()}</section>
  <section class="aside right">
    ${DataPane()}
    ${StylesPane()}
  </section>
</main>`;
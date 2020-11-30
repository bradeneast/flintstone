import { html, nothing } from "../lit-html/lit-html";
import state from "../state";
import addDocument from "../functions/addDocument";
import removeDocument from "../functions/removeDocument";
import renameDocument from "../functions/renameDocument";
import setCurrentDocument from "../functions/setCurrentDocument";

export default () => html`
<h2>Documents</h2>
${
  state.currentDocument
    ? html`
    <div data-active=true>
      <h3>
        <input type=text .value=${state.currentDocument.id} @input=${event => renameDocument(event.target.value)} />
      </h3>
    </div>
    `
    : nothing
}
<ul class=sets>
  ${state.currentUser.documents.map((documents, documentIndex) => html`
  <li>
    <button class=link @click=${() => setCurrentDocument(documentIndex)}>
      <h4>${documents.id}</h4>
    </button>
    <button class=icon @click=${()=> removeDocument(documentIndex)}>🗑️</button>
  </li>
  `)}
  <button @click=${addDocument}>Add Document</button>
</ul>
`
import { html, nothing } from "../lit-html/lit-html";
import state from "../state";
import addDocument from "../functions/addDocument";
import removeDocument from "../functions/removeDocument";
import renameDocument from "../functions/renameDocument";
import setCurrentDocument from "../functions/setCurrentDocument";
import duplicateDocument from "../functions/duplicateDocument";

export default () => html`
<h2>Documents</h2>
${
  state.currentDocument
    ? html`
    <div>
      <h3 data-active=true>
        <input type=text .value=${state.currentDocument.id} @input=${event => renameDocument(event.target.value)} />
      </h3>
    </div>
    `
    : nothing
}
<ul class=sets>
  ${state.currentUser.documents.map((document, documentIndex) => html`
  <li>
    <button class=link @click=${() => setCurrentDocument(documentIndex)}>
      <h4>${document.id}</h4>
    </button>
    <button title="Duplicate ${document.id}" class=icon @click=${() => duplicateDocument(documentIndex)}>📄</button>
    ${
      state.currentUser.documents.length > 1
        ? html`<button title="Delete ${document.id}" class=icon @click=${() => removeDocument(documentIndex)}>🗑️</button>`
        : nothing
    }
  </li>
  `)}
  <button @click=${addDocument}>Add Document</button>
</ul>
`
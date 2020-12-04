import { html, nothing } from "../lit-html/lit-html";
import state from "../state";
import addDocument from "../functions/addDocument";
import removeDocument from "../functions/removeDocument";
import renameDocument from "../functions/renameDocument";
import setCurrentDocument from "../functions/setCurrentDocument";
import duplicateDocument from "../functions/duplicateDocument";
import Button from "./Button";

export default () => html`
<div class="pane documents">
  <h2>Documents</h2>
  ${
    state.currentDocument
    ? html`
    <div class=mount-children>
      <h3 data-active=true>
        <input type=text .value=${state.currentDocument.id} @input=${event=> renameDocument(event.target.value)} />
      </h3>
    </div>
    ` : nothing
  }

  <ul class="sets mount-children">
    ${state.currentUser.documents.map((document, documentIndex) => html`
    <li>
      ${
        Button({
          title: `Select ${document.id}`,
          className: 'link',
          action: () => setCurrentDocument(documentIndex),
          content: html`<h4>${document.id}</h4>`
        })
      }
      ${
        Button({
          title: `Duplicate ${document.id}`,
          className: 'icon',
          action: () => duplicateDocument(documentIndex),
          content: '📄'
        })
      }
      ${
        state.currentUser.documents.length > 1
          ? Button({
              title: `Delete ${document.id}`,
              className: 'icon',
              action: () => removeDocument(documentIndex),
              content: '🗑️'
            })
          : nothing
      }
    </li>
    `)
    }
    <button @click=${addDocument}>Add Document</button>
  </ul>
</div>
`
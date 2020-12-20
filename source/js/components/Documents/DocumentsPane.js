import { html, nothing } from "lit-html";
import state from "../../state";
import addDocument from "../../functions/addDocument";
import removeDocument from "../../functions/removeDocument";
import renameDocument from "../../functions/renameDocument";
import setCurrentDocument from "../../functions/setCurrentDocument";
import duplicateDocument from "../../functions/duplicateDocument";
import Button from "../Button";
import DocumentTOC from "./DocumentTOC";


export default () => {

  let current = state.currentDocument;

  return html`
  <div class="pane documents">
    <label class="smol light" for="currentDocumentTitle">Current document</label>
    ${
    current
      ? html`
      <div class="selection mount">

        <div class="selection__header">
          <h2 data-active=true>
            <input 
            type=text 
            id=currentDocumentTitle
            .value=${current.id} 
            @input=${event => 
              renameDocument(event.target.value)
            } />
          </h2>
        </div>
        
        ${current.body.length ? DocumentTOC() : nothing}
      </div>
      ` : nothing
    }

    <label class="smol light">All documents</label>
    <ul class="sets mount">
      ${state.currentUser.documents.map((document, documentIndex) => html`
      <li data-index=${documentIndex}>
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
      </li>`
      )}
      <button @click=${addDocument}>Add Document</button>
    </ul>
  </div>`;
}
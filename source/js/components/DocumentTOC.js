import { html } from "lit-html";
import state, { setState } from "../state";
import marked from 'marked';
import { $ } from "../utils";


export default () => html`
<h4>Pages</h4>
<ul class=pages>
  ${
    state.currentDocument.body.split(/\n\s*\-{3,}\s*\n/).map((page, index) => html`
    <li>
      <button 
      class=link
      @click=${() => {
        setState('showPreview', true);
        $(`#page_${index + 1}`)?.focus()
      }}>
        ${new DOMParser().parseFromString(marked(page.substr(0, 100)), 'text/html').body.innerText}
      </button>
    </li>`
    )
  }
</ul>`;
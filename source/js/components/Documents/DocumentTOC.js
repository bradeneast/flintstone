import { html } from "lit-html";
import state, { setState } from "../../state";
import { $ } from "../../utils";


export let makePageID = index => `page_${index + 1}`;
export let pageSplitter = /\n\s*\-{3,}\s*\n/;

export default () => {

  let doc = state.currentDocument.body;

  let goToPage = index => {
    setState('showPreview', true);
    $('#' + makePageID(index))?.scrollIntoView();
  }

  let getTOCTitle = (pageContent) => {
    let firstLine = pageContent.match(/.+?(\n|$)/)[0];
    let trimmed = firstLine.trim();
    return trimmed.replace(/^[^A-z0-9]*|[^A-z0-9]*$/g, '');
  }

  let tocItems = doc.split(pageSplitter);
  if (!tocItems.length) tocItems = [doc];

  return html`
  <div class=toc-wrapper>
    <h3>Pages</h3>
    <ol class=toc>
      ${
        tocItems.map((page, index) => html`
        <li>
          <button class=link @click=${() => goToPage(index)}>
            ${index + 1}. ${getTOCTitle(page)}
          </button>
        </li>`
        )
      }
    </ol>
  </div>`
};
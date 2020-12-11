import { html } from "lit-html";
import state, { setState } from "../state";
import { $ } from "../utils";


export let makePageID = index => `page_${index + 1}`;
export let pageSplitter = /\n\s*\-{3,}\s*\n/;

export default () => {

  let goToPage = index => {
    setState('showPreview', true);
    $('#' + makePageID(index))?.scrollIntoView();
  }

  let getTOCTitle = (pageContent) => {
    let firstLine = pageContent.substr(0, pageContent.indexOf('\n'));
    let trimmed = firstLine.trim();
    return trimmed.replace(/[^A-z0-9]*/, '');
  }

  return html`
  <div class=toc-wrapper>
    <h4>Pages</h4>
    <ol class=toc>
      ${state.currentDocument.body
        .split(pageSplitter)
        .map((page, index) => html`
        <li>
          <button class=link @click=${() => goToPage(index)}>
            ${index + 1}. ${getTOCTitle(page)}
          </button>
        </li>`
      )}
    </ol>
  </div>`
};
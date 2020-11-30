import setCurrentContract from "../functions/setCurrentContract";
import { html } from "../lit-html/lit-html";
import state from "../state";

export default () => html`
<h2>Documents</h2>
<ul>
  ${state.currentUser.contracts.map(contract => html`
  <li ?data-active=${contract.id==state.currentContract.id} data-contract-id=${contract.id}>
    <button class=link @click=${setCurrentContract}>
      ${contract.id}
    </button>
  </li>`
)}
</ul>
`
import setCurrentContract from "../functions/setCurrentContract";
import { html } from "../lit-html/lit-html";
import state from "../state";

export default () => html`
<h2>Documents</h2>
<ul>
  ${state.currentUser.contracts.map((contract, index) => html`
  <li ?data-active=${contract.id == state.currentContract.id} data-contract-id=${contract.id}>
    <button class=link @click=${() => setCurrentContract(index)}>
      <h3>${contract.id}</h3>
    </button>
  </li>`
  )}
</ul>
`
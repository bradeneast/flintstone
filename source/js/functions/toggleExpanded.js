import state, { setState } from "../state"

export default (normieName) => {

  let adjustments = state.expandedAdjustments;
  let isExpanded = adjustments.includes(normieName);

  isExpanded
    ? adjustments.splice(adjustments.indexOf(normieName), 1)
    : adjustments.push(normieName);

  setState('expandedAdjustments', adjustments);
}
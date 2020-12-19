import applyFormatting from "./functions/applyFormatting";

const shortcuts = {
  "b": () => applyFormatting('**'),
  "i": () => applyFormatting('_'),
  "`": () => applyFormatting('`'),
  "Delete": () => applyFormatting('~')
}

export default shortcuts;
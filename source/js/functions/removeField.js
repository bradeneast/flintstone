import { findDatasetByID, setState } from "../state"

export default (index, datasetID) => {
  let dataset = findDatasetByID(datasetID);
  dataset.fields.splice(index, 1);
  setState('currentDataset', dataset);
}
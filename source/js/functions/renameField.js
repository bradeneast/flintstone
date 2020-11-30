import { findDatasetByID, setState } from "../state"

export default (index, newKey, datasetID) => {

  let dataset = findDatasetByID(datasetID);
  let [key, value] = dataset.fields[index];
  dataset.fields[index] = [newKey, value];

  setState('currentDataset', dataset);
}
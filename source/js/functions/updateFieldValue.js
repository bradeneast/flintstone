import { findDatasetByID, setState } from "../state"

export default (index, newValue, datasetID) => {

  let dataset = findDatasetByID(datasetID);
  let [key, value] = dataset.fields[index];
  dataset.fields[index] = [key, newValue];

  setState('currentDataset', dataset);
}
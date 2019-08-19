export const removeUndefinedInputs = (records) => {
  for (let record of records) {
    for (let input of Object.keys(record)) {
      if (record[input] === undefined) {
        delete record[input];
      }
    }
  }
  return records;
}

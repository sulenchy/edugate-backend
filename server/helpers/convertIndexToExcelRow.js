const convertIndexToExcelRow = (obj) => {
  const keys = Object.keys(obj);
  const newKeys = keys.map(x => Number(x) + 2);
  const newObj = {};
  for (let key of newKeys) {
    newObj[key] = obj[key - 2];
  }
  return newObj;
};

export default convertIndexToExcelRow;

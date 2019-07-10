const removeDuplicates = (file, duplicates) => {
  let records = Object.keys(duplicates);
  records = records.map(x => Number(x));
  return file.filter((x, i) => !records.includes(i))
};

export default removeDuplicates;

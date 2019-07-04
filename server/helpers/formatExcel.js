import XLSX from 'xlsx';

const formatExcel = (file) => {
  const data = file.data;
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets.Sheet1;
  const array = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: 'empty' });
  return array;
}

export default formatExcel;

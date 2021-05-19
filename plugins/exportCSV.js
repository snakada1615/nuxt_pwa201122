function convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  for (let i = 0; i < array.length; i++) { // eslint-disable-line
    let line = '';
    for (const index in array[i]) { // eslint-disable-line
      if (line !== '') line += ',';
      line += array[i][index];
    }
    str += line + '\r\n'; // eslint-disable-line
  }
  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }
  const jsonObject = JSON.stringify(items);
  const csv = convertToCSV(jsonObject);
  const exportedFilenmae = fileTitle + '.csv' || 'export.csv'; // eslint-disable-line
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export default exportCSVFile;

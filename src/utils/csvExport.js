/* IndustrialCare - CSV Data Export Helper Utility */

export const exportToCSV = (filename, dataRows, columns) => {
  if (!dataRows || dataRows.length === 0) {
    alert('No data records available to export.');
    return;
  }

  const headers = columns.map((col) => col.label).join(',');
  const csvLines = [headers];

  dataRows.forEach((row) => {
    const line = columns
      .map((col) => {
        let val = col.accessor(row);
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""'); // Escape double quotes
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      })
      .join(',');
    csvLines.push(line);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvLines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

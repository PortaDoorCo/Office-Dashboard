import moment from 'moment';

export default (data, startDate, endDate, account, role, status) => {
  // Prepare CSV headers
  const headers = [
    'Date Ordered',
    'Customer',
    'Job ID',
    'Order Type',
    'Total',
    'Discount (%)',
  ];

  // Prepare CSV data rows
  const rows = [];
  let total = 0;

  data.forEach((i) => {
    total = Math.round(100 * (total += i.total)) / 100;

    // Use 0% if no discount is specified (matching the PDF report)
    const discountPercent = i.discount || 0;

    rows.push([
      i.DateOrdered ? moment(i.DateOrdered).format('MM/DD/YYYY') : 'TBD',
      i.job_info?.customer?.Company || '',
      i.id + 100,
      i.orderType || 'Standard',
      i.total?.toFixed(2),
      `${discountPercent}`,
    ]);
  });

  // Add total row
  rows.push([]); // Empty row for spacing
  rows.push(['', '', '', 'Total', total.toFixed(2), '']);

  // Convert to CSV format
  const csvContent = [
    // Add report title and date range as first rows
    [`SALESMEN REPORT - ${account}`],
    [
      `${moment(startDate).format('MM/DD/YYYY')} thru ${moment(endDate).format(
        'MM/DD/YYYY'
      )}`,
    ],
    [], // Empty row for spacing
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((cell) => {
          // Escape cells that contain commas, quotes, or newlines
          if (
            typeof cell === 'string' &&
            (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    )
    .join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `salesmen_report_${moment(startDate).format('MMDDYYYY')}_${moment(
      endDate
    ).format('MMDDYYYY')}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};






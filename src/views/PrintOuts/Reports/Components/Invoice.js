import moment from 'moment';

export default (data, startDate, endDate, status) => {
  let tableBody = [
    [
      { text: 'Invoiced Date' },
      // { text: 'Date Ordered' },
      { text: 'Amount' },
      { text: 'Net Amount' },
      { text: 'Tax' },
      { text: 'Customer Name' },
      { text: 'Job ID' },
      { text: 'Job Description' },
    ],
  ];

  let total = 0;
  let netTotal = 0;
  let taxTotal = 0;

  data.forEach((i, index) => {
    total = Math.round(100 * (total += i.total)) / 100;
    netTotal = Math.round( 100 * (netTotal += (i.total - i.tax))) / 100;
    taxTotal = Math.round(100 *(taxTotal += i.tax)) / 100

    let name = i.job_info?.poNum?.length > 0 ? i.job_info?.poNum : 'None';

    const dateInvoiced = i?.tracking?.filter((x) => {
      return x.status === 'Invoiced';
    });

    return tableBody.push([
      i.DateInvoiced || dateInvoiced.length > 0
        ? moment(i.DateOrdered || dateInvoiced[0].date).format('MM/DD/YYYY')
        : 'TBD',
      `$${i.total?.toFixed(2)}`,
      `$${(i.total - i.tax)?.toFixed(2)}`,
      `$${i.tax?.toFixed(2)}`,
      i.job_info?.customer?.Company,
      i.orderNum,
      name,
    ]);
  });

  let totalBody = [
    [
      'Totals',
      `$${total.toFixed(2)}`,
      `$${netTotal.toFixed(2)}`,
      `$${taxTotal.toFixed(2)}`,
      `Number of Invoices Printed:  ${data.length}`,
    ],
  ];

  return [
    {
      columns: [
        {
          stack: [
            `REPORT - ${moment(startDate).format('MM/DD/YYYY')} thru ${moment(
              endDate
            ).format('MM/DD/YYYY')}`,
          ],
        },
        {
          stack: [{ text: `Status: ${status}`, alignment: 'right' }],
        },
      ],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: tableBody,
        widths: ['*', '*', '*', '*', '*', '*', '*'],
      },
      layout: 'lightHorizontalLines',
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: [60, 59, 58, '*', '*',],
      },
      layout: 'headerLineOnly',
    },
  ];
};

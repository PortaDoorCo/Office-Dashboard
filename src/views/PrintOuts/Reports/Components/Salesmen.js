import moment from 'moment';

export default (data, startDate, endDate, status) => {
  const tableBody = [
    [
      { text: 'Date Ordered' },
      { text: 'Customer' },
      { text: 'Job ID' },
      { text: 'Status' },
      { text: 'Description' },
      { text: 'Total' },
      { text: 'Due On' },
    ],
  ];
  let total = 0;

  data.forEach((i, index) => {
    total = Math.round(100 * (total += i.total)) / 100;

    let name = i.job_info?.poNum ? i.job_info?.poNum : 'None';

    const dateOrdered = i?.tracking?.filter((x) => {
      return x.status === 'Ordered';
    });

    return tableBody.push([
      i.DateOrdered || dateOrdered.length > 0
        ? moment(i.DateOrdered || dateOrdered[0].date).format('MM/DD/YYYY')
        : 'TBD',
      i.job_info?.customer?.Company,
      i.id + 100,
      i.status,
      name,
      i.total?.toFixed(2),
      i.Shipping_Scheduled
        ? moment(i.job_info?.DueDate).format('MM/DD/YYYY')
        : 'TBD',
    ]);
  });
  let totalBody = [
    ['', 'Total'],
    ['', `$${total.toFixed(2)}`],
  ];

  return [
    {
      columns: [
        {
          stack: ['SALESMEN REPORT'],
        },
        {
          stack: [
            `${moment(startDate).format('MM/DD/YYYY')} thru ${moment(
              endDate
            ).format('MM/DD/YYYY')}`,
          ],
        },
        {
          stack: [{ text: `${status}`, alignment: 'right' }],
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
      },
      layout: 'headerLineOnly',
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: [400, '*'],
      },
      layout: 'headerLineOnly',
    },
  ];
};

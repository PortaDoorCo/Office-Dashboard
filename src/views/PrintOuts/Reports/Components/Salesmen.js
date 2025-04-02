import currency from 'currency.js';
import moment from 'moment';

export default (data, startDate, endDate, account, role, status) => {
  const tableBody = [
    [
      { text: 'Date Ordered' },
      { text: 'Customer' },
      { text: 'Job ID' },
      { text: 'Status' },
      { text: 'Description' },
      { text: 'Total' },
      // role?.type === 'owner' ? { text: 'Commission (%)' } : null,
      // role?.type === 'owner' ? { text: 'Commission ($)' } : null,
      { text: 'Due On' },
    ],
  ];
  let total = 0;
  let commission = 0;

  data.forEach((i, index) => {
    total = Math.round(100 * (total += i.total)) / 100;
    commission = currency(
      (commission +=
        (i.total - i.tax) * (i.companyprofile.SC ? i.companyprofile.SC : 0))
    ).value;
    let name = i.job_info?.poNum ? i.job_info?.poNum : 'None';

    return tableBody.push([
      i.DateOrdered ? moment(i.DateOrdered).format('MM/DD/YYYY') : 'TBD',
      i.job_info?.customer?.Company,
      i.id + 100,
      i.status,
      name,
      i.total?.toFixed(2),
      // role?.type === 'owner' ? `${i.companyprofile?.SC * 100}%` : null,
      // role?.type === 'owner'
      //   ? `$${currency((i.total - i.tax) * i.companyprofile?.SC).value.toFixed(
      //       2
      //     )}`
      //   : null,
      i.Shipping_Scheduled
        ? moment(i.job_info?.DueDate).format('MM/DD/YYYY')
        : 'TBD',
    ]);
  });
  let totalBody = [
    ['', 'Total'],
    ['', `$${total.toFixed(2)}`],
  ];

  let totalWidths = [415, '*'];

  // if (role.type === 'owner') {
  //   totalBody = [
  //     ['', 'Total', 'Commission'],
  //     ['', `$${total.toFixed(2)}`, `$${commission.toFixed(2)}`],
  //   ];

  //   if (status === 'Quote') {
  //     totalWidths = [310, '*', '*'];
  //   } else {
  //     totalWidths = [300, '*', '*'];
  //   }
  // }

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
          stack: [{ text: `${account}`, alignment: 'right' }],
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
        widths: totalWidths,
      },
      layout: 'headerLineOnly',
    },
  ];
};

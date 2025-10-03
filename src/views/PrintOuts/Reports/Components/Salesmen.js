import currency from 'currency.js';
import moment from 'moment';

export default (data, startDate, endDate, account, role, status) => {
  const tableBody = [
    [
      { text: 'Date Ordered' },
      { text: 'Customer' },
      { text: 'Job ID' },
      { text: 'Order Type' },
      { text: 'Total' },
      { text: 'Discount (%)' },
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

    // Use 20% if no discount is specified
    const discountPercent = i.discount || 0;

    return tableBody.push([
      i.DateOrdered ? moment(i.DateOrdered).format('MM/DD/YYYY') : 'TBD',
      i.job_info?.customer?.Company,
      i.id + 100,
      i.orderType || 'Standard',
      `$${i.total?.toFixed(2)}`,
      `${discountPercent}%`,
    ]);
  });
  let totalBody = [
    ['', 'Total'],
    ['', `$${total.toFixed(2)}`],
  ];

  let totalWidths = [330, '*']; // Adjusted to align with the Total column

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
        widths: [65, '*', 50, 80, 70, 65], // Date, Customer, JobID, OrderType, Total, Discount
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

import moment from 'moment';

export default (data, breakdowns) => {
  let qty = 0;

  const count = data.flat_stock.map((part, i) => {
    qty += parseInt(part.qty);
  });

  const production_date = data.tracking.filter((x) =>
    ['Quote', 'Ordered', 'Invoiced', 'Order Edited'].every(
      (y) => !x.status.toLowerCase().includes(y.toLowerCase())
    )
  );

  const table_body = [
    [
      { text: 'QTY', style: 'fonts' },
      { text: 'Width', style: 'fonts' },
      { text: 'Length', style: 'fonts' },
      { text: 'Woodtype', style: 'fonts' },
      { text: 'Thickness', style: 'fonts' },
      { text: 'Notes', style: 'fonts' },
    ],
  ];

  const t = data.flat_stock?.forEach((i) => {
    table_body.push([
      { text: i.qty, style: 'fonts' },
      { text: i.width, style: 'fonts' },
      { text: i.length, style: 'fonts' },
      {
        text: `${i.woodtype?.NAME} ${
          i.thickness?.name === 'Select Grade' ? 'Select' : ''
        }`,
        style: 'fonts',
      },
      { text: i.thickness?.thickness_1, style: 'fonts' },
      { text: i.notes ? i.notes : '', style: 'fontsBold' },
    ]);
  });

  // const table_body = [];

  return [
    data.job_info?.Shop_Notes
      ? {
          columns: [
            { text: '' },
            {
              text: `${
                data.job_info?.Shop_Notes
                  ? data.job_info?.Shop_Notes?.toUpperCase()
                  : ''
              }`,
              alignment: 'center',
              style: 'fontsBold',
            },
            { text: '' },
          ],
          margin: [0, -26, 0, 10],
        }
      : null,
    {
      text: 'Flat Stock',
      style: 'headerFont',
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'],
        body: table_body,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 1 ? 1 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineStyle: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return null;
          }
          return { dash: { length: 1, space: 1 } };
        },
        paddingLeft: function (i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        },
      },
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    {
      columns: [
        {
          text: 'OTHER ITEMS',
          style: 'woodtype',
          decoration: 'underline',
          width: 160,
        },
        {
          text: 'QTY',
          style: 'woodtype',
          decoration: 'underline',
        },
      ],
    },
    data.misc_items.length > 0
      ? {
          columns: [
            {
              text: data.misc_items.map((i) => {
                return `${i.item ? i.item.NAME : i.item2 ? i.item2 : ''} \n`;
              }),
              style: 'fonts',
              width: 170,
            },
            {
              style: 'fonts',
              stack: data.misc_items.map((i) => {
                return { text: i.qty ? parseInt(i.qty) : '' };
              }),
              width: 30,
            },
          ],
          margin: [0, 2, 0, 0],
        }
      : null,
    {
      margin: [0, 10, 0, 10],
      columns: [
        {
          text: '',
          width: 200,
        },
        {
          text: 'Checked By: ______________',
          style: 'totals',
          width: 160,
        },
        {
          text: `Payment Method: ${
            data.companyprofile && data.companyprofile.PMT_TERMS
          }`,
          style: 'totals',
          width: 200,
        },
      ],
    },
    {
      columns: [
        {
          text: `Qty Flat Stock: ${qty}`,
          style: 'totals',
          width: 200,
        },
        {
          text: 'Packed By:  _______________',
          style: 'totals',
          width: 160,
        },
        {
          text: `${
            production_date.length < 1
              ? ''
              : `Production Date: ${moment(production_date[0]?.date).format(
                  'MM/DD/YYYY'
                )}`
          }`,
          style: 'totals',
          width: 200,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },

        {
          text: 'Total Weight: _____________',
          style: 'totals',
          width: 160,
        },
        {
          text: `Est. Completion: ${
            data.Shipping_Scheduled
              ? `${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
              : 'TBD'
          }`,
          style: 'totals',
          width: 200,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: `Ship Via: ${
            data.job_info &&
            data.job_info.shipping_method &&
            data.job_info.shipping_method.NAME
          }`,
          style: 'totals',
          width: 200,
        },
        {
          text: "Total # Inv's: ______________",
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },
        {
          text: 'Received In Good Condition: ___________________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
  ];
};

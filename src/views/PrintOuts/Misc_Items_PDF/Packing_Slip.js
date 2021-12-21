
export default (data, breakdowns) => {

  let qty = 0;

  const count = data.misc_items.map((part, i) => {
    qty += (i+ 1);
  });

  const table_body = [
    [
      { text: 'Line', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'QTY', style: 'fonts' },
    ]
  ];


  data.misc_items.map((i, index)  => {
    if(i.category === 'preselect') {
      return table_body.push([
        { text: index + 1, style: 'fonts' },

        { text: i.item.NAME, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return table_body.push([
        { text: index + 1, style: 'fonts' },

        { text: i.item2, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
      ]);
    } else {
      return [];
    }
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
      } : null,
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*'],
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
      margin: [0, 10, 0, 10],
      columns: [
        {
          text: `Ship Via: ${
            data.job_info &&
                    data.job_info.shipping_method &&
                    data.job_info.shipping_method.NAME
          }`,
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
          text: '',
          style: 'totals',
          width: 200,
        },
        {
          text: 'Packed By:  _______________',
          style: 'totals',
          width: 347,
        },
        {
          text: '',
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
          width: 347,
        },
        {
          text: '',
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
          text: 'Total # Inv\'s: ______________',
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

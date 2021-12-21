

export default (data, breakdowns) => {

  const tableBody = [
    [
      { text: 'Line', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'QTY', style: 'fonts' },
      { text: 'CHK', style: 'fonts' },
    ],
  ];

  const t = data.misc_items?.forEach((i, index) => {

    if(i.category === 'preselect') {
      return tableBody.push([
        { text: index + 1, style: 'fonts' },
  
        { text: i.item.NAME, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
        { text: '[      ]', style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return tableBody.push([
        { text: index + 1, style: 'fonts' },
  
        { text: i.item2, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
        { text: '[      ]', style: 'fonts' },
      ]);
    } else {
      return [];
    }

  });



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
        widths: [30, '*', '*', '*'],
        body: tableBody,
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
    // { text: '', pageBreak: 'before' }
  ];
};

export default (data, breakdowns) => {
  const tableBody = [
    [
      { text: 'Width', style: 'fonts' },
      { text: 'Length', style: 'fonts' },
      { text: 'Woodtype', style: 'fonts' },
      { text: 'Thickness', style: 'fonts' },
      { text: 'Notes', style: 'fonts' },
      { text: 'CHK', style: 'fonts' },
    ],
  ];

  const t = data.flat_stock?.forEach((i) => {
    tableBody.push([
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
      { text: '[      ]', style: 'fonts' },
    ]);
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

export default (data, breakdowns) => {
  const tableBody = [
    [
      { text: 'Linear Ft', style: 'fonts' },
      { text: 'Style', style: 'fonts' },
      { text: 'Grade', style: 'fonts' },
      { text: 'Woodtype', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'Notes', style: 'fonts' },
    ],
  ];

  const t = data.mouldings?.forEach((i) => {
    tableBody.push([
      { text: i.linearFT, style: 'fonts' },
      { text: i.style?.name, style: 'fonts' },
      { text: i.grade?.name, style: 'fonts' },
      { text: i.woodtype?.NAME, style: 'fonts' },
      {
        text:
          i.style?.value === 'custom'
            ? `Width: ${i.width}" \n Thickness: ${i.thickness}"`
            : i.item?.NAME,
        style: 'fonts',
      },
      { text: i.notes ? i.notes : '', style: 'fontsBold' },
    ]);
  });

  return [
    {
      columns: [
        { text: '' },
        {
          alignment: 'center',
          style: 'fontsBold',
          stack: [
            data.job_info?.Shop_Notes
              ? {
                  text: `${
                    data.job_info?.Shop_Notes
                      ? data.job_info?.Shop_Notes?.toUpperCase()
                      : ''
                  }`,
                }
              : null,
            {
              text: data?.misc_items?.map((i) => {
                if (i.category === 'preselect') {
                  if (
                    i?.item?.NAME?.toLowerCase()?.includes('delivery') ||
                    i?.item?.NAME?.toLowerCase()?.includes('price') ||
                    i?.item?.NAME?.toLowerCase()?.includes('discount') ||
                    i?.item?.NAME?.toLowerCase()?.includes('rush') ||
                    i?.item?.NAME?.toLowerCase()?.includes('credit') ||
                    i?.item?.NAME?.toLowerCase()?.includes('service charge')
                  ) {
                    return null;
                  } else {
                    return `${i.item?.NAME} \n`;
                  }
                } else {
                  if (
                    i?.item2?.toLowerCase()?.includes('delivery') ||
                    i?.item2?.toLowerCase()?.includes('price') ||
                    i?.item2?.toLowerCase()?.includes('discount') ||
                    i?.item2?.toLowerCase()?.includes('rush') ||
                    i?.item2?.toLowerCase()?.includes('credit') ||
                    i?.item2?.toLowerCase()?.includes('service charge')
                  ) {
                  } else {
                    return `${i.item2} \n`;
                  }
                }
              }),
            },
          ],
        },
        { text: '' },
      ],
      margin: [0, -26, 0, 10],
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

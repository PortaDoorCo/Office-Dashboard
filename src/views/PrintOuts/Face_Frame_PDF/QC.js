import Size from '../Breakdowns/Doors/Size';
import Glass_Selection from '../Sorting/Glass_Selection';

export default (data, breakdowns) => {
  return [
    Glass_Selection(data).map((i, index) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'CHK', style: 'fonts' },
          { text: 'L/R', style: 'fonts' },
          { text: 'Build Instruction', style: 'fonts' },
          { text: 'Cab#', style: 'fonts' },
        ],
      ];

      i.dimensions.forEach((item, index) => {
        // Panels(item, i, breakdowns);
        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item), style: 'fonts' },
          { text: '[      ]', style: 'fonts' },
          { text: 'N/A', style: 'fonts' },
          item.notes || item.full_frame || item.lite
            ? {
                text: `${item.notes ? item.notes.toUpperCase() : ''} ${
                  item.full_frame ? 'Full Frame DF' : ''
                } ${item.lite ? item.lite.NAME : ''}`,
                style: 'tableBold',
                alignment: 'left',
              }
            : null,
          item.cab_number
            ? {
                text: `${item.cab_number}`,
                style: 'fonts',
                alignment: 'left',
              }
            : null,
        ]);
      });

      return [
        {
          stack: [
            index === 0
              ? {
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
                          text: data.misc_items.map((i) => {
                            if (i.category === 'preselect') {
                              if (
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'delivery'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'price'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'discount'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'rush'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'credit'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'service charge'
                                ) ||
                                i?.item?.NAME?.toLowerCase()?.includes(
                                  'deposit'
                                )
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
                                i?.item2
                                  ?.toLowerCase()
                                  ?.includes('service charge') ||
                                i?.item2?.toLowerCase()?.includes('deposit')
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
                  margin: [0, -26, 0, 0],
                }
              : null,
            {
              margin: [0, 10, 0, 0],
              columns: [
                {
                  width: 280,
                  stack: [
                    {
                      text: `${
                        i.thickness?.grade_name ? i.thickness?.grade_name : ''
                      }${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${
                        i.thickness.thickness_2
                      }"`,
                      style: 'woodtype',
                    },
                    {
                      text: `${
                        i.face_frame_design ? i.face_frame_design.NAME : ''
                      }`,
                      style: 'fonts',
                    },
                    // {
                    //   text: `${i.orderType ? i.orderType.name : ''}`,
                    //   style: 'fonts',
                    // },
                  ],
                },
                // { text: ' ', style: 'fontsBold' },
                {
                  stack: [
                    { text: ' ', style: 'woodtype' },
                    {
                      text: `Panel: ${
                        i.panel
                          ? i.panel.NAME
                          : i.orderType.value === 'Slab_Door' ||
                            i.orderType.value === 'Slab_DF'
                          ? ''
                          : 'Glass'
                      } ${i.lite ? '- ' + i.lite.NAME : ''}`,
                      style: 'fonts',
                      alignment: 'right',
                    },
                  ],
                },
                {
                  stack: [
                    { text: ' ', style: 'woodtype' },
                    {
                      text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
                      style: 'fonts',
                      alignment: 'right',
                    },
                  ],
                },
                {
                  stack: [
                    { text: ' ', style: 'woodtype' },
                    {
                      text: `Thickness:  ${
                        i.thickness ? i.thickness.thickness_2 : ''
                      }"`,
                      style: 'fonts',
                      alignment: 'right',
                    },
                  ],
                },
                {
                  stack: [
                    { text: ' ', style: 'woodtype' },
                    {
                      text: `Edge: ${i.edge ? i.edge.NAME : 'None'}`,
                      style: 'fonts',
                      alignment: 'right',
                    },
                  ],
                },
              ],
            },
            {
              text: '==============================================================================',
              alignment: 'center',
            },
            {
              margin: [0, 0, 0, 10],
              table: {
                headerRows: 1,
                widths: [22, 15, 110, 40, 40, 155, '*'],
                body: tableBody,
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i > 0) {
                    return 1;
                  } else {
                    return 0;
                  }
                },
                vLineWidth: function (i, node) {
                  return 0;
                },
                hLineStyle: function (i, node) {
                  if (i === 1) {
                    return { dash: { length: 1, space: 1 } };
                  } else {
                    return 1;
                  }
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
          ],
        },
      ];
    }),
    // { text: '', pageBreak: 'before' }
  ];
};

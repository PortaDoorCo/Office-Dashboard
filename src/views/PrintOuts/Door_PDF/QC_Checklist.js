import Size from '../Breakdowns/Doors/Size';
import Glass_Selection from '../Sorting/Glass_Selection';

export default (data, breakdowns) => {
  let itemNum = 0;

  return [
    Glass_Selection(data).map((i, index) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'CHK', style: 'fonts' },
          // { text: 'L/R', style: 'fonts' },
          { text: 'Build Instruction', style: 'fonts' },
          { text: 'Cab#', style: 'fonts' },
        ],
      ];

      i.dimensions.forEach((item, index) => {
        // Panels(item, i, breakdowns);

        itemNum += 1;

        tableBody.push([
          { text: item.item ? item.item : itemNum, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item), style: 'fonts' },
          { text: '[      ]', style: 'fonts' },
          // { text: 'N/A', style: 'fonts' },
          item.notes || item.lite
            ? {
                text: `${item.notes ? item.notes : ''} ${
                  item.lite ? item.lite.NAME : ''
                }`,
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
                              if (i.item?.NAME?.includes('Delivery')) {
                                return null;
                              } else {
                                return `${i.item?.NAME} \n`;
                              }
                            } else {
                              return `${i.item2} \n`;
                            }
                          }),
                        },
                      ],
                    },
                    { text: '' },
                  ],
                  margin: [0, -29, 0, 0],
                }
              : null,
            {
              stack: [
                {
                  margin: [0, 15, 0, 0],
                  stack: [
                    {
                      columns: [
                        {
                          width: 200,
                          stack: [
                            {
                              text: `${
                                i.thickness?.grade_name
                                  ? i.thickness?.grade_name
                                  : ''
                              }${i.woodtype.NAME} - ${
                                i.thickness.thickness_1
                              } - ${i.thickness.thickness_2}"`,
                              style: 'woodtype',
                              width: 300,
                            },
                            {
                              text: `${
                                i.construction.value === 'Slab'
                                  ? 'Slab'
                                  : i.design
                                  ? i.design.NAME
                                  : i.face_frame_design
                                  ? i.face_frame_design.NAME
                                  : ''
                              } ${
                                i.construction.value === 'MT' ||
                                i.construction.value === 'Miter'
                                  ? i.construction.value
                                  : ''
                              } ${
                                i.profile?.NAME.includes('Deluxe')
                                  ? 'Deluxe'
                                  : ''
                              }`,
                              style: 'fonts',
                            },

                            // {
                            //   text: `${i.orderType ? i.orderType.name : ''}`,
                            //   style: 'fonts',
                            // },
                          ],
                        },
                        // { text: ' ', style: 'fontsBold', width: 140 },
                        {
                          stack: [
                            { text: ' ', style: 'woodtype' },
                            {
                              text: `Panel: ${
                                i.construction?.value === 'Slab'
                                  ? 'Solids'
                                  : i.panel
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
                              text: `IP: ${
                                i.construction?.value === 'Slab'
                                  ? 'None'
                                  : (i.construction?.value === 'Cope' ||
                                      i.design?.NAME?.includes('PRP 15') ||
                                      i.design?.NAME?.includes('PRP15')) &&
                                    i.profile
                                  ? i.profile.NAME
                                  : i.design
                                  ? i.design.NAME
                                  : 'None'
                              }`,
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
                              text: `Edge: ${
                                i.edge && i?.construction?.value !== 'Miter'
                                  ? i.edge.NAME
                                  : 'None'
                              }`,
                              style: 'fonts',
                              alignment: 'right',
                            },
                          ],
                        },
                      ],
                    },
                    i.applied_profile && i.applied_profile.NAME !== 'None'
                      ? {
                          text: `${
                            i.applied_profile &&
                            i.applied_profile.NAME !== 'None'
                              ? i.applied_profile.NAME.toUpperCase()
                              : ''
                          }`,
                          style: 'headerFont',
                          alignment: 'center',
                          margin: [0, 10, 0, 0],
                        }
                      : null,
                  ],
                },
                {
                  text: '==============================================================================',
                  alignment: 'center',
                },
              ],
            },
            {
              margin: [0, 0, 0, 10],
              table: {
                headerRows: 1,
                widths: [22, 15, 110, 40, 155, '*'],
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

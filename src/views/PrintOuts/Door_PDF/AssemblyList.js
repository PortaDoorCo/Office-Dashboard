import Panels from '../Breakdowns/Doors/Panels/Panels';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Size from '../Breakdowns/Doors/Size';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import GlassSort from '../Sorting/GlassSort';

export default (data, breakdowns) => {
  let itemNum = 0;

  // const newData = data.part_list.map((i) => {
  //   return {
  //     ...i,
  //     dimensions: i.dimensions.map((v) => {
  //       return {
  //         ...v,
  //         construction: i.construction,
  //         profile: i.profile,
  //         design: i.design,
  //         edge: i.edge,
  //         panel: i.panel,
  //         orderType: i.orderType,
  //         VERTICAL_GRAIN: i.VERTICAL_GRAIN
  //       };
  //     }),
  //   };
  // });

  const table_content = data.part_list.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'WxH', style: 'fonts' },
        { text: 'Stile', style: 'fonts' },
        { text: 'Rails', style: 'fonts' },
        { text: 'Panels WxH', style: 'fonts' },
      ],
    ];

    GlassSort(i).forEach((item, ind) => {
      itemNum += 1;

      tableBody.push([
        { text: item.item ? item.item : itemNum, style: 'fonts' },
        { text: item.qty, style: 'fonts' },
        {
          stack: [
            { text: `${Size(item)}`, style: 'fonts' },
            item.notes || item.full_frame || item.lite
              ? {
                  text: `${item.notes ? item.notes.toUpperCase() : ''} ${
                    item.lite ? item.lite.NAME : ''
                  }`,
                  style: 'tableBold',
                  alignment: 'left',
                }
              : null,
          ],
        },
        {
          text: (Stiles(item, i, breakdowns) || []).map((stile) => {
            return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
          }),
          style: 'fonts',
        },
        {
          text: (Rails(item, i, breakdowns) || []).map((rail) => {
            return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
              item.full_frame ? '** Full Frame DF **' : ''
            }`;
          }),
          style: 'fonts',
        },
        {
          stack: [
            {
              text: (Panels(item, i, breakdowns) || []).map((panel) => {
                return `${panel.qty} ${panel.measurement} ${
                  '- ' + panel.pattern
                } \n`;
              }),
              style: 'fonts',
            },
            item.cab_number
              ? {
                  text: `Cab#: ${item.cab_number ? item.cab_number : ''}`,
                  style: 'tableBold',
                  alignment: 'left',
                }
              : null,
          ],
        },
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
                            if (i?.item?.NAME.includes('Delivery')) {
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
                margin: [0, -26, 0, 0],
              }
            : null,
          {
            id: 'parts',
            margin: [0, 10, 0, 0],
            stack: [
              {
                columns: [
                  {
                    stack: [
                      {
                        text: `${i.orderType ? i.orderType.name : ''}`,
                        style: 'fonts',
                      },
                      {
                        text: `${
                          i?.construction?.value === 'Slab'
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
                          i.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''
                        } - ${
                          i.construction?.value === 'Slab'
                            ? ''
                            : i.panel
                            ? i.panel.NAME
                            : 'Glass'
                        }`,
                        style: 'fonts',
                      },
                      {
                        text: `${
                          i.thickness?.grade_name ? i.thickness?.grade_name : ''
                        }${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${
                          i.thickness.thickness_2
                        }"`,
                        style: 'woodtype',
                      },
                    ],
                  },
                  {
                    stack: [
                      {
                        text: '',
                        style: 'fontsBold',
                        alignment: 'center',
                      },
                      {
                        text: `${
                          i.applied_profile && i.applied_profile.NAME !== 'None'
                            ? i.applied_profile.NAME.toUpperCase()
                            : ''
                        }`,
                        style: 'headerFont',
                        alignment: 'center',
                      },
                    ],
                  },
                  {
                    stack: [
                      {
                        text: `Thickness:  ${
                          i.thickness ? i.thickness.thickness_2 : ''
                        }"`,
                        style: 'fonts',
                      },
                      {
                        text: `IP:  ${
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
                        }   Edge:  ${i.edge ? i.edge.NAME : 'None'}`,
                        style: 'fonts',
                      },
                      // { text: `Applied Profile: ${i.applied_profile ? i.applied_profile.NAME : 'None'}`, style: 'fonts' },
                    ],
                    alignment: 'right',
                  },
                ],
              },
              {
                text: '==============================================================================',
                alignment: 'center',
                margin: [0, 0, 0, 0],
              },
              {
                table: {
                  headerRows: 1,
                  widths: [21, 20, 94, 105, 105, 110],
                  body: tableBody,
                  dontBreakRows: true,
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
            ],
          },

          {
            text: '==============================================================================',
            alignment: 'center',
          },

          // tableBody.length > 12 && index !== data.part_list.length - 1 ? {
          //   text: '',
          //   pageBreak: 'after' // or after
          // } : null
        ],
      },
    ];
  });

  const newTable = {
    ...table_content,
  };

  table_content.map((i) => {});

  return [
    table_content,
    // { text: '', pageBreak: 'before' }
  ];
};

import Panels from '../Breakdowns/Doors/Panels/Panels';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Size from '../Breakdowns/Doors/Size';
import SlabSize from '../Breakdowns/Doors/SlabSize';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import GlassSort from '../Sorting/GlassSort';

export default (data, breakdowns) => {
  let itemNum = 0;

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

    if (i?.construction?.value === 'Slab') {
      i.dimensions.forEach((item, index) => {
        itemNum += 1;
        tableBody.push([
          { text: itemNum, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          {
            stack: [
              { text: `${SlabSize(item, i.edge?.LIP_FACTOR)}`, style: 'fonts' },
              item.notes || item.full_frame || item.lite
                ? {
                    text: `${item.notes ? item.notes.toUpperCase() : ''} ${
                      item.full_frame ? 'Full Frame DF' : ''
                    } ${item.lite ? item.lite.NAME : ''}`,
                    style: 'tableBold',
                    alignment: 'left',
                  }
                : null,
            ],
          },
          {
            text: Stiles(item, i, breakdowns).map((stile) => {
              return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
                item.full_frame ? '** Full Frame DF **' : ''
              }`;
            }),
            style: 'fonts',
          },
          { text: SlabSize(item, i.edge?.LIP_FACTOR), style: 'fonts' },
        ]);
      });
    } else {
      GlassSort(i).forEach((item, index) => {
        itemNum += 1;

        tableBody.push([
          { text: itemNum, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          {
            stack: [
              { text: `${Size(item)}`, style: 'fonts' },
              item.notes || item.full_frame || item.lite
                ? {
                    text: `${item.notes ? item.notes.toUpperCase() : ''} ${
                      item.full_frame ? 'Full Frame DF' : ''
                    } ${item.lite ? item.lite.NAME : ''}`,
                    style: 'tableBold',
                    alignment: 'left',
                  }
                : null,
            ],
          },
          {
            text: Stiles(item, i, breakdowns).map((stile) => {
              return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
                item.full_frame ? '** Full Frame DF **' : ''
              }`;
            }),
            style: 'fonts',
          },
          {
            stack: [
              {
                text: Panels(item, i, breakdowns).map((panel) => {
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
    }

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
                              i?.item?.NAME?.toLowerCase()?.includes('price') ||
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'discount'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes('rush')
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
                              i?.item?.NAME?.toLowerCase()?.includes('rush')
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
                stack: [
                  {
                    text: `${i.orderType ? i.orderType.name : ''}`,
                    style: 'fonts',
                  },
                  {
                    text: `${
                      i.face_frame_design ? i.face_frame_design.NAME : ''
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
                text: `${i.notes ? i.notes.toUpperCase() : ''}`,
                style: 'fontsBold',
                alignment: 'center',
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
                      i.profile ? i.profile.NAME : 'None'
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
              widths: [21, 15, 94, 105, 105, 115],
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
        ],
      },
    ];
  });

  return [
    table_content,
    // { text: '', pageBreak: 'before' }
  ];
};

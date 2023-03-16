import { flatten } from 'lodash';
import numQty from 'numeric-quantity';
import Size from '../Breakdowns/Doors/Size';
import Glass_Selection from '../Sorting/Glass_Selection';
import moment from 'moment';

export default (data, breakdowns) => {
  const qty = data.part_list.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const getName = (i) => {
    return `${
      i.construction.value === 'Slab'
        ? 'Slab'
        : i.design
        ? i.design.NAME
        : i.face_frame_design
        ? i.face_frame_design.NAME
        : ''
    } ${
      i.construction.value === 'MT' || i.construction.value === 'Miter'
        ? i.construction.value
        : ''
    } ${i.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''}`;
  };

  // let itemNum = 0;

  // const itemNumCounter = {
  //   ...data,
  //   part_list: data.part_list.map((i) => {
  //     return {
  //       ...i,
  //       dimensions: i.dimensions.map((j) => {
  //         itemNum += 1;
  //         return {
  //           ...j,
  //           item: itemNum,
  //         };
  //       }),
  //     };
  //   }),
  // };

  const a = Glass_Selection(data).map((v) => {
    return {
      ...v,
      dimensions: flatten(
        v.dimensions.map((d) => ({
          ...d,
          name: getName(v),
          panel: v.panel,
          profile: v.profile,
        }))
      ),
    };
  });

  const table_body = a.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Actual Size', style: 'fonts' },
        // { text: 'Panel', style: 'fonts', alignment: 'left' },
        { text: 'IP', style: 'fonts', alignment: 'left' },
        { text: 'Note', style: 'fonts' },
        { text: 'Cab#', style: 'fonts' },
      ],
    ];

    const b = i.dimensions.sort((a, b) => numQty(b.height) - numQty(a.height));

    b.forEach((item, index) => {
      tableBody.push([
        { text: item.item ? item.item : index + 1, style: 'fonts' },
        {
          text: item?.construction?.value === 'Slab' ? 'Slab' : item.name,
          style: 'fonts',
        },
        { text: `${item.qty}`, style: 'fonts' },
        {
          text: `${Size(item)}`,
          style: 'fonts',
        },
        {
          text:
            i.construction?.value === 'Slab'
              ? 'None'
              : (item.construction?.value === 'Cope' ||
                  item.design?.NAME?.includes('PRP 15') ||
                  item.design?.NAME?.includes('PRP15')) &&
                item.profile
              ? item.profile.NAME
              : item.design
              ? item.design.NAME
              : '',
          style: 'fonts',
          alignment: 'left',
        },
        item.notes || item.full_frame || item.lite
          ? {
              text: `${item.notes ? item.notes.toUpperCase() : ''} ${
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
                            if (
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'delivery'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes('price') ||
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'discount'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes('rush') ||
                              i?.item?.NAME?.toLowerCase()?.includes('credit')
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
                              i?.item2?.toLowerCase()?.includes('credit')
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
            margin: [0, 15, 0, 0],
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
                        text: `${i.woodtype.NAME} - ${
                          i.thickness.value === 1 || i.thickness.value === 2
                            ? '4/4'
                            : i.thickness.value === 3 || i.thickness.value === 4
                            ? '5/4'
                            : i.thickness.value === 5 || i.thickness.value === 6
                            ? '6/4'
                            : i.thickness.value === 7 || i.thickness.value === 8
                            ? '8/4'
                            : ''
                        }`,
                        style: 'woodtype',
                        width: 370,
                      },
                    ],
                  },
                  {
                    stack: [
                      {
                        text: '',
                        alignment: 'left',
                        style: 'fontsBold',
                        width: 80,
                      },
                      i.edge
                        ? {
                            text: `Edge: ${
                              i.edge && i?.construction?.value !== 'Miter'
                                ? i.edge.NAME
                                : 'None'
                            }`,
                            alignment: 'right',
                            style: 'fonts',
                          }
                        : null,
                      {
                        text: `Panel: ${
                          i.construction?.value === 'Slab'
                            ? 'Solids'
                            : i.panel
                            ? i.panel.NAME
                            : 'Glass'
                        }`,
                        alignment: 'right',
                        style: 'woodtype',
                      },
                    ],
                  },
                ],
              },
              i.applied_profile && i.applied_profile.NAME !== 'None'
                ? {
                    text: `${
                      i.applied_profile && i.applied_profile.NAME !== 'None'
                        ? i.applied_profile.NAME.toUpperCase()
                        : ''
                    }`,
                    style: 'headerFont',
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                  }
                : null,
            ],
          },
          // {
          //   text:
          //     '==============================================================================',
          //   alignment: 'center',
          // },
          {
            table: {
              headerRows: 1,
              widths: [22, 50, 20, '*', '*', '*', '*'],
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

      // { text: '', pageBreak: 'before' }
    ];
  });

  // const table_body = [];

  const production_date = data.tracking.filter((x) =>
    ['Quote', 'Ordered', 'Invoiced', 'Order Edited'].every(
      (y) => !x.status.toLowerCase().includes(y.toLowerCase())
    )
  );

  return [
    table_body,
    {
      stack: [
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
                    return `${
                      i.item ? i.item.NAME : i.item2 ? i.item2 : ''
                    } \n`;
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
              text: `Qty Doors: ${qty.reduce((acc, item) => acc + item, 0)}`,
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
              text: 'Drawer Fronts: 0',
              style: 'totals',
              width: 200,
            },

            {
              text: 'Total Weight: _____________',
              style: 'totals',
              width: 160,
            },
            {
              text: `Due Date: ${
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
      ],
    },
  ];
};

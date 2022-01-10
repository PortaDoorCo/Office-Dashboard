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
      i.design
        ? i.design.NAME
        : i.face_frame_design
          ? i.face_frame_design.NAME
          : i.construction.value === 'Slab'
            ? 'Slab'
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
    console.log({ v });

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
        { text: item.name, style: 'fonts' },
        { text: `${item.qty}`, style: 'fonts' },
        {
          text: `${Size(item)}`,
          style: 'fonts',
        },
        {
          text: item.profile
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
        unbreakable: true,
        stack: [
          index === 0 && data.job_info?.Shop_Notes
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
              margin: [0, -26, 0, 0],
            }
            : null,
          {
            unbreakable: true,
            margin: [0, 10, 0, 0],
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
                      text: `Edge: ${i.edge ? i.edge.NAME : ''}`,
                      alignment: 'right',
                      style: 'fonts',
                    }
                    : null,
                  {
                    text: `Panel: ${
                      i.panel
                        ? i.panel.NAME
                        : i.construction.value === 'Slab'
                          ? 'Slab'
                          : 'Glass'
                    }`,
                    alignment: 'right',
                    style: 'woodtype',
                  },
                ],
              },
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
      unbreakable: true,
      stack: [
        {
          unbreakable: true,
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
            unbreakable: true,
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
              text: `${
                data.status === 'Quote'
                  ? ''
                  : `Estimated Ship: ${moment(data.job_info.DueDate).format(
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
              text: `Ship Via: ${
                data.job_info &&
                data.job_info.shipping_method &&
                data.job_info.shipping_method.NAME
              }`,
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
      ],
    },
  ];
};

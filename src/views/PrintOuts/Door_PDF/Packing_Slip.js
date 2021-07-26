import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';
import { flattenDeep, uniq, flatten, groupBy } from 'lodash';
import Glass_Selection from '../Sorting/Glass_Selection';

export default (data, breakdowns) => {
  console.log({ data });

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
          : i.orderType.value === 'Slab_Door' || i.orderType.value === 'Slab_DF'
            ? ''
            : ''
    }`;
  };
  const a = Object.values(
    groupBy(Glass_Selection(data), (x) => x?.woodtype?.NAME)
  );

  console.log({ a });

  const b = a
    .map((woodtype) => {
      console.log({ woodtype });

      return woodtype.map(v => {
        console.log({v});
        return {
          ...v,
          dimensions: flatten(
            v.dimensions.map((d) => ({ ...d, name: getName(v), panel: v.panel }))
          ),
        };
      });

      
    })
    .map((t, x) => ({
      ...t[0],
      dimensions: flatten(t.map((c) => c.dimensions)),
    }));

  console.log({b});

  const table_body = b.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Actual Size', style: 'fonts' },
        { text: 'Panel', style: 'fonts', alignment: 'left' },
        { text: 'IP', style: 'fonts', alignment: 'left' },
        { text: 'Note', style: 'fonts' },
        { text: 'Cab#', style: 'fonts' },
      ],
    ];
    i.dimensions.forEach((item, index) => {
      tableBody.push([
        { text: index + 1, style: 'fonts' },
        { text: item.name, style: 'fonts' },
        { text: `${item.qty}`, style: 'fonts' },
        {
          text: `${Size(item)}`,
          style: 'fonts',
        },
        {
          text: item.panel ? item.panel.NAME : '',
          style: 'fonts',
          alignment: 'left',
        },
        {
          text: i.profile ? i.profile.NAME : '',
          style: 'fonts',
          alignment: 'left',
        },
        item.notes || item.full_frame || item.lite
          ? {
            text: `${item.notes ? item.notes : ''} ${
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
        margin: [0, 0, 0, 0],
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
          widths: [22, 50, 20, 100, 60, 50, 90, 22],
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
  });

  // const table_body = [];

  return [
    {
      columns: [
        {
          stack: [
            { text: `Our Order: ${data.orderNum}`, style: 'fonts' },
            {
              text: `Job: ${data.status === 'Quote' ? 'QUOTE' : ''} - ${
                data.job_info?.poNum
              }`,
              style: 'fonts',
            },
          ],
        },
        {
          stack: [
            {
              text: 'PACKING SLIP',
              alignment: 'right',
              style: 'woodtype',
              decoration: 'underline',
            },
            {
              text: `Ship Via: ${data.job_info?.shipping_method?.NAME}`,
              alignment: 'right',
              style: 'fonts',
            },
          ],
        },
      ],
    },
    {
      columns: [
        {
          text: '',
        },
        {
          stack: [
            {
              text: 'Porta Door Co, INC.',
              alignment: 'center',
              style: 'fonts',
            },
            {
              text: 'Phone: 203-888-6191  Fax: 203-888-5803',
              alignment: 'center',
              style: 'fonts',
            },
            {
              text: 'Email: Info@portadoor.com',
              alignment: 'center',
              style: 'fonts',
            },
          ],
        },
        {
          text: '',
        },
      ],
    },
    {
      columns: [
        {
          width: 200,
          stack: [
            {
              columns: [
                {
                  text: 'Sold To: ',
                  width: 60,
                },
                {
                  stack: [
                    { text: `${data.job_info.customer.Company}` },
                    // {
                    //   text: `${
                    //     data.companyprofile.Contact
                    //       ? data.companyprofile.Contact
                    //       : ''
                    //   }`,
                    //   style: 'fonts',
                    // },
                    {
                      text: `${
                        data.companyprofile.Address1
                          ? data.companyprofile.Address1
                          : ''
                      }`,
                      style: 'fonts',
                    },
                    {
                      text: `${data.companyprofile.City}, ${data.job_info.State} ${data.job_info.Zip}`,
                      style: 'fonts',
                    },
                    {
                      text: `Ph: ${data.companyprofile.Phone1}`,
                      style: 'fonts',
                    },
                    data.companyprofile.Fax
                      ? {
                        text: `Fax: ${
                          data.companyprofile.Fax
                            ? data.companyprofile.Fax
                            : ''
                        }`,
                        style: 'fonts',
                        margin: [0, 0, 0, 10],
                      }
                      : null,
                  ],
                },
              ],

              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
          ],
          style: 'fonts',
        },

        {
          text: '',
          // width: 200,
          alignment: 'center',
        },
        {
          stack: [
            {
              margin: [10, 0, 0, 0],
              columns: [
                {
                  width: 40,
                  stack: [
                    {
                      text: 'Ship To: ',
                      style: 'fonts',
                      alignment: 'left',
                      margin: [0, 0, 0, 0],
                    },
                  ],
                },
                {
                  stack: [
                    {
                      text: `${data.job_info.customer.Company}`,
                      style: 'fonts',
                      // alignment: 'right',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${data.job_info.Address1}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${
                        data.job_info.Address2 ? data.job_info.Address2 : ''
                      }`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${data.job_info.City}, ${data.job_info.State} ${data.job_info.Zip}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    // {
                    //   text: `${data.job_info.Zip}`,
                    //   alignment: 'left',
                    //   style: 'fonts',
                    //   margin: [0, 0, 0, 0],
                    // },
                    {
                      text: `${data.companyprofile.Phone1}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    table_body,
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
              return `${i.item ? i.item.NAME : i.item2 ? i.item2 : ''} \n`;
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
          text: 'Drawer Fronts: 0',
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
  ];
};

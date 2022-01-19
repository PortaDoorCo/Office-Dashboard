import numQty from 'numeric-quantity';
import pdfDrawerBoxPricing from '../../../selectors/pdfs/pdfDrawerBoxPricing';
import Size from '../Breakdowns/DrawerBoxes/Size';
import moment from 'moment';

export default (data, breakdowns, pricing) => {
  const qty = data.part_list.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const prices = pdfDrawerBoxPricing(data.part_list, pricing[0]);

  const subTotal = prices
    .map((i) => i.reduce((acc, item) => acc + item, 0))
    .reduce((acc, item) => acc + item, 0);

  const balancePaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + balance.balance_paid;
  },
  0);

  const balanceDue = data.total - balancePaid;

  const miscTotal = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const discountTotal = subTotal * (data.discount / 100);

  const discountSubTotal = subTotal - subTotal * (data.discount / 100);

  let itemNum = 0;

  const production_date = data.tracking.filter((x) =>
    ['Quote', 'Ordered', 'Invoiced', 'Order Edited'].every(
      (y) => !x.status.toLowerCase().includes(y.toLowerCase())
    )
  );

  return [
    data.part_list.map((part, i) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Style', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size', style: 'fonts' },
          { text: 'Note', style: 'fonts' },
          { text: 'Cab#', style: 'fonts' },
        ],
      ];

      const itemize = part.dimensions.map((i) => {
        itemNum += 1;
        return {
          ...i,
          item: itemNum,
        };
      });

      let sortedDimensions = itemize.sort(function (a, b) {
        return numQty(b.height) - numQty(a.height);
      });

      sortedDimensions.forEach((item, index) => {
        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          { text: `Drawer Box ${part.box_thickness.NAME}`, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          item.notes
            ? {
              text: `${item.notes ? item.notes.toUpperCase() : ''}`,
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
            i === 0
              ? {
                columns: [
                  { text: '' },
                  {
                    alignment: 'center',
                    style: 'fontsBold',
                    stack: [
                      data.job_info?.Shop_Notes ?{
                        text: `${
                          data.job_info?.Shop_Notes
                            ? data.job_info?.Shop_Notes?.toUpperCase()
                            : ''
                        }`,
                      } : null,
                      { text : data.misc_items.map(i => {
                        if(i.category === 'preselect'){
                          if(i.item.NAME.includes('Delivery')){
                            return null;
                          } else {
                            return `${i.item?.NAME} \n`;
                          }
                        
                        } else {
                          return `${i.item2} \n`;
                        }
                      })
                      }
                    ]
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
                      text: `Drawer Box ${part.box_thickness.NAME}`,
                      style: 'fonts',
                    },
                    { text: `${part.woodtype.NAME}`, style: 'woodtype' },
                  ],
                },
                {
                  text: '',
                  style: 'fontsBold',
                  alignment: 'center',
                },
                {
                  stack: [
                    {
                      text: `${part.box_bottom_thickness.NAME} ${part.box_bottom_woodtype.NAME} Bottom`,
                      style: 'fonts',
                    },
                    {
                      text: `${
                        i.box_notch &&
                        i.box_notch.NAME === 'Yes - Add in Misc Items'
                          ? 'Notch and Drilled'
                          : ''
                      }`,
                      style: 'fonts',
                    },
                  ],
                  alignment: 'right',
                },
              ],
            },
            {
              text: '==============================================================================',
              alignment: 'center',
            },
            {
              table: {
                headerRows: 1,
                widths: [22, '*', 22, '*', '*', '*'],
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
    }),
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
          text: `Drawer Boxes: ${qty.reduce((acc, item) => acc + item, 0)}`,
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
          text: '',
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
              ? `${moment(data.job_info.DueDate).format(
                'MM/DD/YYYY'
              )}`
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

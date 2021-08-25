import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';
import pdfDrawerBoxPricing from '../../../selectors/pdfs/pdfDrawerBoxPricing';

export default (data, pricing) => {
  const qty = data.part_list.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const balancePaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + balance.balance_paid;
  },
  0);

  const misc_prices = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const prices = pdfDrawerBoxPricing(data.part_list, pricing[0]);

  console.log({ prices: pricing });

  const subTotal = prices
    .map((i) => i.reduce((acc, item) => acc + item, 0))
    .reduce((acc, item) => acc + item, 0);

  const misc_total = misc_prices.reduce((acc, item) => acc + item, 0);

  const discountTotal = subTotal * (data.discount / 100);

  const discountSubTotal = subTotal - discountTotal;

  const order_sub_total = misc_total + discountSubTotal;

  const tax = data.Taxable
    ? order_sub_total * (data.companyprofile.TaxRate / 100)
    : 0;

  const total = order_sub_total + tax;

  const balanceDue = total - balancePaid;

  const limitedLiability =
    'Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com and in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product';

  return [
    {
      columns: [
        {

          stack: [{ text: 'ACKNOWLEDGEMENT', margin: [0, 0, 0, -10] }],
          style: 'headerFont',
        },

        {
          stack: [
            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            {
              text: '203-888-6191',
              alignment: 'center',
              margin: [0, 0, 0, 10],
            },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
          ],
          // width: 200,
          alignment: 'center',
        },
        {
          stack: [
            {
              text:
                data.job_info.Rush && data.job_info.Sample
                  ? 'Sample / Rush'
                  : data.job_info.Rush
                    ? 'Rush'
                    : data.job_info.Sample
                      ? 'Sample'
                      : '',
              alignment: 'right',
              style: 'rushFonts',
            },
            {
              text: `Order #: ${data.orderNum}`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `${
                data.status === 'Quote'
                  ? ''
                  : `Estimated Ship: ${moment(data.job_info.DueDate).format(
                    'MM/DD/YYYY'
                  )}`
              }`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `Ship Via: ${
                data.job_info.shipping_method
                  ? data.job_info.shipping_method.NAME
                  : ' '
              }`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `Salesmen: ${data.sale ? data.sale.fullName : ''}`,
              alignment: 'right',
              style: 'headerFont',
            },
          ],
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
                  text: 'Customer - ',
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
                    {
                      text: `Terms: ${
                        data.companyprofile.PMT_TERMS
                          ? data.companyprofile.PMT_TERMS
                          : ''
                      }`,
                      style: 'fonts',
                    },
                  ],
                },
              ],

              style: 'fontsBold',
              margin: [0, 0, 0, 0],
            },
          ],
          style: 'headerFont',
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
                      text: 'Job: ',
                      alignment: 'left',
                      margin: [0, 0, 0, 0],
                      style: 'fonts',
                    },
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
                      text: `${
                        data.job_info.poNum.length > 0
                          ? data.job_info.poNum.toUpperCase()
                          : 'None'
                      }`,
                      alignment: 'left',
                      margin: [0, 0, 0, 0],
                      style: 'fonts',
                    },
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
      margin: [0, 5, 0, 0],
    },
    data.part_list.map((part, i) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },

          { text: 'Actual Size WxDxH', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Notes', style: 'fonts' },
          { text: 'Total 1 Unit', style: 'fonts' },
          { text: 'Total Cost', style: 'fonts' },
        ],
      ];

      let sortedDimensions = part.dimensions.map((j, k) => ({...j, item: k + 1 })).sort(function (a, b) {
        return a.item - b.item;
      });
      sortedDimensions.forEach((item, index) => {
        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
          { text: `${item.notes ? item.notes.toUpperCase() : ''}`, style: 'fonts' },
          {
            text: `${(prices[i][index] / parseInt(item.qty)).toFixed(2)}`,
            style: 'fonts',
          },
          {
            text: `${prices[i][index].toFixed(2)}`,
            style: 'fonts',
            alignment: 'right',
          },
        ]);
      });

      return [
        {
          margin: [0, 0, 0, 0],
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
              text: `${part.notes ? part.notes.toUpperCase() : ''}`,
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
        // {
        //   margin: [0, 10, 0, 0],
        //   columns: [
        //     {
        //       stack: [

        //       ],
        //       width: 260,
        //     },
        //   ],
        // },
        {
          table: {
            headerRows: 1,
            widths: [30, 114, 30, 155, '*', '*'],
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
          stack: [
            {
              columns: [
                {
                  text: '-------',
                  margin: [164, 0, 0, 0],
                },
              ],
              margin: [0, 0, 0, -10],
            },
            {
              columns: [
                {
                  text: '------------',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 0, 0, -10],
            },
            {
              columns: [
                {
                  text: '',
                  width: 120,
                },
                {
                  text: ' Total: ',
                  width: 55,
                  style: 'fonts',
                  alignment: 'left',
                },
                { text: `${qty[i]}`, style: 'fonts', alignment: 'left' },
                {
                  margin: [14, 0, 0, 0],
                  columns: [
                    {
                      text: 'Item Subtotal',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                      alignment: 'right',
                      width: 79,
                    },
                    {
                      text: `$${data.subTotals[i].toFixed(2)}`,
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                      alignment: 'right',
                      width: 77,
                    },
                  ],
                },
              ],
              margin: [0, 10, 0, 5],
            },
          ],
        },

        {
          text: '==============================================================================',
          alignment: 'center',
        },
      ];
    }),
    {
      columns: [
        {
          text: `Total Number of Pieces: ${qty.reduce(
            (acc, item) => acc + item,
            0
          )}`,
          style: 'fonts',
          width: 317,
        },
        {
          text: 'Order Subtotal',
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 120,
          alignment: 'right',
        },
        {
          text: `$${subTotal.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 317 },
        {
          text: `${data.discount > 0 ? data.discount + '% ' + 'Discount' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          alignment: 'right',
          width: 120,
        },
        {
          text: `${
            data.discount > 0 ? '-' + '$' + discountTotal.toFixed(2) : ''
          }`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 0],
    },
    {
      text: '------------',
      margin: [0, 0, 0, 0],
      alignment: 'right',
    },
    {
      columns: [
        { text: '', style: 'totals', width: 317 },
        {
          text: `${data.discount > 0 ? 'Discount Subtotal' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 120,
          alignment: 'right',
        },
        {
          text: `${data.discount > 0 ? '$' + discountSubTotal.toFixed(2) : ''}`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 0],
    },
    data.misc_items.length > 0
      ? {
        columns: [
          {
            text: `${
              data.misc_items.length > 0 ? 'Miscellaneous Extra' : ''
            }`,
            style: 'fonts',
            decoration: 'underline',
            width: 168,
          },
          {
            text: 'Qty',
            style: 'fonts',
            decoration: 'underline',
            width: 33,
          },
          {
            text: 'Cost Per',
            style: 'fonts',
            margin: [0, 0, 0, 0],
            decoration: 'underline',
          },
          {
            text: '',
            style: 'totals',
            margin: [0, 0, 0, 0],
            alignment: 'right',
          },
        ],
        margin: [0, 10, 0, 0],
      }
      : null,
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
          {
            text: data.misc_items.map((i) => {
              return `$${
                i.price
                  ? parseFloat(i.price).toFixed(2)
                  : i.pricePer
                    ? parseFloat(i.pricePer).toFixed(2)
                    : 0
              } \n`;
            }),
            style: 'fonts',
            margin: [0, 0, 0, 0],
          },
          {
            text: data.misc_items.map((i) => {
              return `$${
                i.price
                  ? (parseFloat(i.price) * parseFloat(i.qty)).toFixed(2)
                  : i.pricePer
                    ? (parseFloat(i.pricePer) * parseFloat(i.qty)).toFixed(2)
                    : 0
              } \n`;
            }),
            style: 'fonts',
            alignment: 'right',
          },
        ],
        margin: [0, 2, 0, 0],
      }
      : null,
    data.misc_items.length > 0
      ? {
        text: '------------',
        margin: [0, 0, 0, 0],
        alignment: 'right',
      }
      : null,
    data.misc_items.length > 0
      ? {
        columns: [
          { text: '', style: 'totals', decoration: 'underline', width: 317 },
          {
            text: data.misc_items.length > 0 ? 'Order Sub Total' : '',
            style: 'totals',
            width: 120,
            alignment: 'right',
          },
          {
            text:
                data.misc_items.length > 0
                  ? '$' + order_sub_total.toFixed(2)
                  : '',
            style: 'fonts',
            margin: [0, 0, 0, 0],
            alignment: 'right',
          },
        ],
        margin: [0, 10, 0, 0],
      }
      : null,
    data.Taxable
      ? {
        columns: [
          { text: '', style: 'totals', width: 317 },
          {
            text: data.Taxable
              ? '$' +
                  order_sub_total.toFixed(2) +
                  ' x ' +
                  data.companyprofile.TaxRate +
                  '%' +
                  ' Tax:'
              : '',
            style: 'totals',
            margin: [0, 0, 0, 4],
            width: 120,
            alignment: 'right',
          },
          {
            text: `${data.Taxable && tax > 0 ? '$' + tax.toFixed(2) : ''}`,
            style: 'fonts',
            alignment: 'right',
          },
        ],
        margin: [0, 0, 0, 0],
      }
      : null,
    {
      text: '======',
      margin: [0, 0, 0, 0],
      alignment: 'right',
    },
    {
      columns: [
        { text: '', style: 'totals', width: 317, decoration: 'underline' },
        {
          text: `${data.status === 'Quote' ? 'QUOTE ONLY' : 'TOTAL'}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          alignment: 'right',
          width: 120,
        },
        {
          text: `$${total.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 317, decoration: 'underline' },
        {
          text: 'Minus Balance Paid:',
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 120,
          alignment: 'right',
        },
        {
          text: `$${balancePaid.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 2, 0, 0],
    },
    {
      text: '======',
      margin: [0, 0, 0, 0],
      alignment: 'right',
    },
    {
      columns: [
        { text: '', style: 'totals', width: 330 },
        {
          text: 'BALANCE DUE:',
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 105,
          alignment: 'right',
        },
        {
          text: `$${balanceDue.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 15, 0, 0],
    },
    {
      stack: [
        {
          text: 'LIMITED WARRANTY',
          decoration: 'underline',
          style: 'fontsBold',
          margin: [0, 0, 0, 10],
        },
        {
          text: limitedLiability.toUpperCase(),
          style: 'warrantyFont',
          alignment: 'left',
          margin: [0, 0, 0, 5],
        },
      ],
    },
    {
      columns: [
        {
          text: moment().format('MM-D-YYYY'),
          style: 'fonts',
          alignment: 'left',
          margin: [0, 0, 0, 0],
        },
        {
          text: `Units: ${qty.reduce((acc, item) => acc + item, 0)}`,
          style: 'fonts',
          alignment: 'right',
          margin: [0, 0, 0, 0],
        },
      ],
    },

    // { text: '', pageBreak: 'before' }
  ];
};

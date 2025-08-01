import pdfDoorPricing from '../../../selectors/pdfs/pdfFaceFramePricing';
import pdfFinishing from '../../../selectors/pdfs/pdfFinishingPricing';
import Size from '../Breakdowns/Doors/Size';
import Glass_Selection from '../Sorting/Glass_Selection';
import currency from 'currency.js';

export default (data, pricing) => {
  const qty = data.part_list.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const prices = pdfDoorPricing(data.part_list, pricing[0], data.itemPrice);
  const finishing = pdfFinishing(data?.part_list, pricing[0]);

  const subTotal = prices
    .map((i) => i.reduce((acc, item) => acc + currency(item).value, 0))
    .reduce((acc, item) => acc + currency(item).value, 0);

  const finishingSubtotal = finishing.map((i, index) => {
    if (i) {
      let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
      let sum = price;
      return sum;
    } else {
      return 0;
    }
  });

  const finishingTotal = parseFloat(
    finishingSubtotal.reduce((acc, item) => acc + item, 0)
  );

  const subTotal_Total = subTotal + finishingTotal;

  const misc_prices = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const misc_total = misc_prices.reduce((acc, item) => acc + item, 0);

  const discountTotal = currency(subTotal_Total).multiply(
    data.discount / 100
  ).value;

  const discountSubTotal = currency(subTotal).subtract(discountTotal).value;

  const order_sub_total = currency(misc_total)
    .add(discountSubTotal)
    .add(finishingTotal).value;

  // Calculate 4% credit card fee if NonCashPayment is true
  const creditCardFee = data.NonCashPayment
    ? currency(order_sub_total).multiply(0.04).value
    : 0;

  const taxableBase = currency(order_sub_total).add(creditCardFee).value;

  const tax = data.Taxable
    ? currency(taxableBase).multiply(data.companyprofile.TaxRate / 100).value
    : 0;

  const total = currency(order_sub_total).add(creditCardFee).add(tax).value;

  const balancePaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + (balance.balance_paid || 0);
  },
  0);

  const depositPaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + (balance.deposit_paid || 0);
  },
  0);

  const balanceDue = currency(total)
    .subtract(depositPaid)
    .subtract(balancePaid).value;

  const misc_items = [
    [
      { text: 'Miscellaneous Extra', style: 'misc_items' },
      { text: 'Qty', style: 'misc_items' },
      { text: 'Cost Per', style: 'misc_items' },
      { text: '', style: 'fonts' },
    ],
  ];

  data.misc_items.forEach((i) => {
    misc_items.push([
      {
        text: `${i.item ? i.item.NAME : i.item2 ? i.item2 : ''}`,
        style: 'fonts',
      },
      { text: i.qty ? parseInt(i.qty) : '', style: 'fonts' },
      {
        text: `$${
          i.price
            ? parseFloat(i.price).toFixed(2)
            : i.pricePer
            ? parseFloat(i.pricePer).toFixed(2)
            : 0
        }`,
        style: 'fonts',
      },
      {
        text: `$${
          i.price
            ? (parseFloat(i.price) * parseFloat(i.qty)).toFixed(2)
            : i.pricePer
            ? (parseFloat(i.pricePer) * parseFloat(i.qty)).toFixed(2)
            : 0
        }`,
        style: 'fonts',
        alignment: 'right',
      },
    ]);
  });

  const table_content = Glass_Selection(data, null).map((part, i) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Actual Size WxH', style: 'fonts' },
        { text: 'Qty', style: 'fonts', alignment: 'center' },
        { text: 'Notes', style: 'fonts' },
        { text: 'Sketch #', style: 'fonts' },
        { text: 'Total 1 Unit', style: 'fonts', alignment: 'right' },
        { text: 'Total Cost', style: 'fonts', alignment: 'right' },
      ],
    ];

    part.dimensions.forEach((item, index) => {
      const price = prices[i][index] / parseInt(item.qty);

      tableBody.push([
        { text: index + 1, style: 'fonts' },
        { text: `${Size(item)}`, style: 'fonts' },
        { text: `${item.qty}`, style: 'fonts', alignment: 'center' },
        {
          text: `${item.notes ? item.notes.toUpperCase() : ''} ${
            item.full_frame ? 'Full Frame DF' : ''
          } ${item.lite ? item.lite.NAME : ''}`,
          style: 'fontsBold',
        },
        {
          text: `${item.cab_number ? item.cab_number : ''}`,
          style: 'fonts',
        },

        {
          text: `${price.toFixed(2)}`,
          style: 'fonts',
          alignment: 'right',
        },
        {
          text: `${(price * parseFloat(item.qty)).toFixed(2)}`,
          style: 'fonts',
          alignment: 'right',
          width: 210,
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
                text: `${part.orderType ? part.orderType.name : ''}`,
                style: 'fonts',
              },
              {
                text: `${
                  part.thickness?.grade_name ? part.thickness?.grade_name : ''
                }${part.woodtype.NAME} - ${part.thickness?.thickness_1} - ${
                  part.thickness?.thickness_2
                }"`,
                style: 'fonts',
              },

              {
                text: `${
                  part.face_frame_design ? part.face_frame_design.NAME : ''
                }`,
                style: 'fonts',
              },
            ],
          },

          {
            width: 200,
            stack: [
              {
                text: `${part.notes ? part.notes.toUpperCase() : ''}`,
                style: 'headerFont',
                alignment: 'center',
              },
            ],
          },
          {
            stack: [
              //something here
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
          widths: [30, 100, 30, 120, '*', '*', '*'],
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
                    text: `${prices[i]
                      .reduce(
                        (acc, item) => acc + Math.round(item * 100) / 100,
                        0
                      )
                      .toFixed(2)}`,
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
  });

  return [
    //table content here
    table_content,

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
          text: `${data.discount > 0 ? data.discount + '% Discount' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          alignment: 'right',
          width: 120,
        },
        {
          text: `${data.discount > 0 ? '- $' + discountTotal.toFixed(2) : ''}`,
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
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: [168, 33, 200, '*'],
            heights: -5,

            style: 'fonts',
            body: misc_items,
          },
        }
      : null,
    data.NonCashPayment
      ? {
          columns: [
            { text: '', style: 'totals', width: 317 },
            {
              text: `Non Cash Price: $${creditCardFee.toFixed(2)}`,
              style: 'totals',
              margin: [0, 0, 0, 0],
              width: 120,
              alignment: 'right',
            },
            {
              text: `$${taxableBase.toFixed(2)}`,
              style: 'fonts',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 0],
        }
      : null,
    data.NonCashPayment
      ? {
          text: '------------',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        }
      : null,
    {
      columns: [
        { text: '', style: 'totals', width: 317 },
        {
          text: data.Taxable
            ? '$' +
              taxableBase.toFixed(2) +
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
    },
    {
      text: '======',
      margin: [0, 0, 0, 0],
      alignment: 'right',
    },
    finishingTotal > 0
      ? {
          columns: [
            { text: '', style: 'totals', width: 317, decoration: 'underline' },
            {
              text: `${finishingTotal > 0 ? 'Finish Total' : ''}`,
              style: 'totals',
              margin: [0, 0, 0, 0],
              alignment: 'right',
              width: 120,
            },
            {
              text: `$${finishingTotal.toFixed(2)}`,
              style: 'fonts',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 0],
        }
      : null,
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
    depositPaid !== 0
      ? {
          columns: [
            { text: '', style: 'totals', width: 317, decoration: 'underline' },
            {
              text: 'Minus Deposit Received:',
              style: 'totals',
              margin: [0, 0, 0, 0],
              width: 120,
              alignment: 'right',
            },
            {
              text: `$${depositPaid.toFixed(2)}`,
              style: 'fonts',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
          margin: [0, 2, 0, 0],
        }
      : null,
    balancePaid !== 0
      ? {
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
        }
      : null,
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
      margin: [0, 10, 0, 5],
    },

    {
      stack: [
        {
          columns: [
            {
              text: 'LIMITED WARRANTY',
              decoration: 'underline',
              style: 'fontsBold',
              margin: [0, 0, 0, 10],
            },
            {
              text: `Units: ${qty.reduce((acc, item) => acc + item, 0)}`,
              style: 'fonts',
              alignment: 'right',
              margin: [0, 0, 0, 0],
            },
          ],
        },

        {
          text: 'OUR PRODUCTS ARE WARRANTED FOR 1 YEAR FROM DATE OF SHIPMENT, WARRANTY DETAILS CAN FOUND AT \n HTTPS://PORTADOOR.COM AND IN OUR CATALOG \n \n LIABILITY UNDER THIS WARRANTY SHALL BE LIMITED TO THE ORIGINAL INVOICE PRICE OF THE PRODUCT',
          style: 'warrantyFont',
          alignment: 'left',
          margin: [0, 0, 0, 5],
          id: 'liability-invoice',
        },
        new Date(data.created_at) >= new Date('2025-03-03')
          ? {
              text: 'CUSTOMER PRICING NOTICE',
              style: 'fontsBold',
              alignment: 'left',
              margin: [0, 5, 0, 0],
            }
          : null,
        new Date(data.created_at) >= new Date('2025-03-03')
          ? {
              text: 'Our listed prices incorporate a 4% discount for cash payments. If an alternative payment method is used, an additional 4% will be applied to the final amount.',
              style: 'fonts',
              alignment: 'left',
              margin: [0, 5, 0, 5],
            }
          : null,
      ],
    },
  ];
};

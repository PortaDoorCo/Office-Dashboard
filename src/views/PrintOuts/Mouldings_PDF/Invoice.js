import moment from 'moment';
import pdfMouldingPricing from '../../../selectors/pdfs/pdfMouldingsPricing';
import currency from 'currency.js';

export default (data, pricing) => {
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

  const misc_prices = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const prices = pdfMouldingPricing(data.mouldings, pricing[0]);

  const subTotal =
    Math.round(
      prices.reduce((acc, item) => acc + currency(item).value, 0) * 100
    ) / 100;

  const misc_total = misc_prices.reduce((acc, item) => acc + item, 0);

  const discountTotal = currency(subTotal).multiply(data.discount / 100).value;

  const discountSubTotal = currency(subTotal).subtract(discountTotal).value;

  const order_sub_total = currency(misc_total).add(discountSubTotal).value;

  const tax = data.Taxable
    ? currency(order_sub_total).multiply(data.companyprofile.TaxRate / 100)
        .value
    : 0;

  const total = currency(order_sub_total).add(tax).value;

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

  const tableBody = [
    [
      { text: 'Style', style: 'fonts' },
      { text: 'Material', style: 'fonts' },
      // { text: 'Thickness', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'Linear FT', style: 'fonts' },
      { text: 'Notes', style: 'fonts' },
      { text: 'Price', style: 'fonts' },
    ],
  ];

  data.mouldings.map((i, p) => {
    const { item, woodtype, linearFT, grade } = i;

    tableBody.push([
      { text: i.style?.name, style: 'fonts' },
      {
        text: `${i.woodtype?.NAME} ${
          i.grade?.name === 'Select Grade' ? 'Select' : ''
        }`,
        style: 'fonts',
      },
      // { text: i.thickness.NAME, style: 'fonts' },
      {
        text:
          i.style?.value === 'custom'
            ? `Width: ${i.width}" \n Thickness: ${i.thickness}"`
            : i.item?.NAME,
        style: 'fonts',
      },
      { text: i.linearFT, style: 'fonts' },
      { text: i.notes ? i.notes : '', style: 'fontsBold' },
      { text: `$${prices[p].toFixed(2)}`, style: 'fonts' },
    ]);
  });

  return [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'],
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
      margin: [0, 0, 0, 20],
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    {
      columns: [
        {
          text: ' ',
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
    // {
    //   columns: [
    //     { text: '', style: 'totals', width: 317 },
    //     {
    //       text: 'Net Total',
    //       style: 'totals',
    //       margin: [0, 0, 0, 4],
    //       width: 120,
    //       alignment: 'right',
    //     },
    //     {
    //       text: '$' + order_sub_total.toFixed(2),
    //       style: 'fonts',
    //       alignment: 'right',
    //     },
    //   ],
    //   margin: [0, 0, 0, 5],
    // },

    // data.misc_items.length > 0
    //   ? {
    //     columns: [
    //       { text: '', style: 'totals', decoration: 'underline', width: 317 },
    //       {
    //         text: data.misc_items.length > 0 ? 'Order Sub Total' : '',
    //         style: 'totals',
    //         width: 120,
    //         alignment: 'right',
    //       },
    //       {
    //         text:
    //               data.misc_items.length > 0
    //                 ? '$' + order_sub_total.toFixed(2)
    //                 : '',
    //         style: 'fonts',
    //         margin: [0, 0, 0, 0],
    //         alignment: 'right',
    //       },
    //     ],
    //     margin: [0, 10, 0, 0],
    //   }
    //   : null,
    // {
    //   text: '======',
    //   margin: [0, 0, 0, 0],
    //   alignment: 'right',
    // },
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
              text: 'Our listed prices incorporate a 4% discount for cash payments. If an alternative payment method is used, an additional 4% fee will be applied to the final amount.',
              style: 'fonts',
              alignment: 'left',
              margin: [0, 5, 0, 5],
            }
          : null,
      ],
    },
  ];
};

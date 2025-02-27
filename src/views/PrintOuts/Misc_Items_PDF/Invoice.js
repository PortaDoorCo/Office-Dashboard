import moment from 'moment';
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

  const prices = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseInt(i.qty) * currency(i.price).value;
    } else {
      return i.pricePer ? parseInt(i.qty) * currency(i.pricePer).value : 0;
    }
  });

  const subTotal =
    Math.round(prices.reduce((acc, item) => acc + item, 0) * 100) / 100;

  const misc_total = prices.reduce((acc, item) => acc + item, 0);

  const discountTotal = currency(subTotal).multiply(data.discount / 100).value;

  const discountSubTotal = currency(subTotal).subtract(discountTotal).value;

  const order_sub_total = discountSubTotal;

  const tax = data.Taxable
    ? currency(order_sub_total).multiply(data.companyprofile.TaxRate / 100)
        .value
    : 0;

  const total = currency(order_sub_total).add(tax).value;

  const balanceDue = currency(total)
    .subtract(depositPaid)
    .subtract(balancePaid).value;

  const tableBody = [
    [
      { text: 'Qty', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'Total 1 Unit', style: 'fonts' },
      { text: 'Price', style: 'fonts' },
    ],
  ];

  data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return tableBody.push([
        { text: i.qty, style: 'fonts' },
        { text: i.item.NAME, style: 'fonts' },
        { text: `$${i.price.toFixed(2)}`, style: 'fonts' },
        { text: `$${(i.price * i.qty).toFixed(2)}`, style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return tableBody.push([
        { text: i.qty, style: 'fonts' },
        { text: i.item2, style: 'fonts' },
        {
          text: i.pricePer
            ? `$${parseFloat(i.pricePer).toFixed(2)}`
            : `$${i.price?.toFixed(2)}`,
          style: 'fonts',
        },
        {
          text: `$${(
            (parseFloat(i.pricePer) || parseFloat(i.price)) * parseFloat(i.qty)
          ).toFixed(2)}`,
          style: 'fonts',
        },
      ]);
    } else {
      return [];
    }
  });

  const limitedLiability =
    'OUR PRODUCTS ARE WARRANTED FOR 1 YEAR FROM DATE OF SHIPMENT, WARRANTY DETAILS CAN FOUND AT \n HTTPS://PORTADOOR.COM AND IN OUR CATALOG \n \n LIABILITY UNDER THIS WARRANTY SHALL BE LIMITED TO THE ORIGINAL INVOICE PRICE OF THE PRODUCT';

  return [
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
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
        {
          text: 'CUSTOMER PRICING NOTICE',
          style: 'fontsBold',
          alignment: 'left',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'Our listed prices incorporate a 4% discount for cash payments. If an alternative payment method is used, an additional 4% fee will be applied to the final amount.',
          style: 'fonts',
          alignment: 'left',
          margin: [0, 5, 0, 5],
        },
      ],
    },
  ];
};

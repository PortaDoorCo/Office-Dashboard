import moment from 'moment';
import pdfMouldingPricing from '../../../selectors/pdfs/pdfMouldingsPricing';

export default (data, pricing) => {
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

  const prices = pdfMouldingPricing(data.mouldings, pricing[0]);

  

  const subTotal = prices.reduce((acc, item) => acc + item, 0);

  const misc_total = misc_prices.reduce((acc, item) => acc + item, 0);

  const discountTotal = (subTotal * (data.discount / 100));

  const discountSubTotal = Math.floor((subTotal - discountTotal) * 100) / 100; 

  const order_sub_total = Math.floor((misc_total + discountSubTotal) * 100) / 100;  

  const tax = data.Taxable
    ? order_sub_total * (data.companyprofile.TaxRate / 100)
    : 0;

  const total = order_sub_total + tax;

  const balanceDue = total - balancePaid;

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

  data.mouldings.map((i) => {
    let price = 0;

    const { item, woodtype, linearFT, grade } = i;

    if (i.style?.value === 'custom') {

      price = 0;

      const width = i.width ? parseFloat(i.width) : 0;
      const thickness = i.thickness ? parseFloat(i.thickness) : 0;
      const linFt = parseFloat(linearFT);

      let wood = 0;

      let feet = Math.floor(((width * 12) / 144) * 100) / 100;
      let waste = feet * 1.25;

      let premium = 0;

      if (thickness <= 0.8125) {
        premium = 1;
      } else if (thickness <= 1.125) {
        premium = 1.25;
      } else if (thickness <= 1.31) {
        premium = 1.5;
      } else if (thickness <= 1.8125) {
        premium = 2;
      } else if (thickness <= 2.31) {
        premium = 2.5;
      } else {
        premium = 3;
      }

      if (thickness <= 1) {
        if (grade?.name === 'Standard Grade') {
          wood = woodtype?.STANDARD_GRADE ? woodtype?.STANDARD_GRADE / 4 : 0;
        } else if (grade?.name === 'Select Grade') {
          wood = woodtype?.SELECT_GRADE ? woodtype?.SELECT_GRADE / 4 : 0;
        }
      } else {
        if (grade?.name === 'Standard Grade') {
          wood = woodtype?.STANDARD_GRADE_THICK
            ? woodtype?.STANDARD_GRADE_THICK / 4
            : 0;
        } else if (grade?.name === 'Select Grade') {
          wood = woodtype?.SELECT_GRADE_THICK
            ? woodtype?.SELECT_GRADE_THICK / 4
            : 0;
        }
      }

      const bd_ft = waste * premium;

      price = Math.floor((bd_ft * wood * linFt * 4) * 100) / 100;

    } else {
      if (i.item) {

        let feet = Math.floor(((item.MOULDING_WIDTH * 12) / 144) * 100) / 100; 
        let waste = feet * 1.25;
        let multiplier = item.Multiplier;
        let wood = woodtype ? woodtype[grade?.db_name] * 0.25 : 0;
        let premium = 0;

        let newWood = wood;

        if (multiplier <= 1) {
          newWood = wood;
        } else {
          newWood = wood * 1.25;
        }

        let a = waste * multiplier;

        if (parseFloat(linearFT) > 0 && parseFloat(linearFT) <= 30) {
          premium = 3 + 1;
        } else if (parseFloat(linearFT) >= 31 && parseFloat(linearFT) <= 50) {
          premium = 2 + 1;
        } else if (parseFloat(linearFT) >= 51 && parseFloat(linearFT) <= 100) {
          premium = 1.75 + 1;
        } else if (parseFloat(linearFT) > 101 && parseFloat(linearFT) <= 250) {
          premium = 1.4 + 1;
        } else if (parseFloat(linearFT) > 251 && parseFloat(linearFT) <= 500) {
          premium = 1.1 + 1;
        } else {
          premium = 1 + 1;
        }
        price = Math.floor((a * newWood * parseFloat(linearFT) * premium) * 100) / 100;
      }
    }

    

    tableBody.push([
      { text: i.style?.name, style: 'fonts' },
      { text: `${i.woodtype?.NAME} ${i.grade?.name === 'Select Grade' ? 'Select' : ''}`, style: 'fonts' },
      // { text: i.thickness.NAME, style: 'fonts' },
      { text: i.style?.value === 'custom' ? `Width: ${i.width}" \n Thickness: ${i.thickness}"` : i.item?.NAME, style: 'fonts' },
      { text: i.linearFT, style: 'fonts' },
      { text: i.notes ? i.notes : '', style: 'fontsBold' },
      { text: `$${price.toFixed(2)}`, style: 'fonts' },
    ]);
  });

  const limitedLiability =
    'Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com and in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product';

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
      margin: [0, 10, 0, 5],
    },
  
    {
      unbreakable: true,
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
          text: 'OUR PRODUCTS ARE WARRANTED FOR 1 YEAR FROM DATE OF SHIPMENT, WARRANTY DETAILS CAN FOUND AT \n HTTPS://PORTADOOR.COM AND IN OUR 2020 CATALOG \n \n LIABILITY UNDER THIS WARRANTY SHALL BE LIMITED TO THE ORIGINAL INVOICE PRICE OF THE PRODUCT',
          style: 'warrantyFont',
          alignment: 'left',
          margin: [0, 0, 0, 5],
          id: 'liability-acknowledgement',
        },
      ],
    },
  ];
};

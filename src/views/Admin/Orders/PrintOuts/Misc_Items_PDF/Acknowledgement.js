import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';


export default (data, breakdowns) => {

  const subTotal = data.subTotals;
  
  const balancePaid = data.balance_history.reduce(function (accumulator, balance) {
    return accumulator + balance.balance_paid;
  }, 0);

  const balanceDue = data.total - balancePaid;

  const tableBody = [
    [
      { text: 'Qty', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'Total 1 Unit', style: 'fonts' },
      { text: 'Price', style: 'fonts' },
    ]
  ];


  data.misc_items.map(i  => {
    if(i.category === 'preselect') {
      return tableBody.push([
        { text: i.qty, style: 'fonts' },
        { text: i.item.NAME, style: 'fonts' },
        { text: `$${i.price}`, style: 'fonts' },
        { text: `$${(i.price * i.qty).toFixed(2)}`, style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return tableBody.push([
        { text: i.qty, style: 'fonts' },
        { text: i.item2, style: 'fonts' },
        { text: i.pricePer, style: 'fonts' },
        { text: `$${(parseFloat(i.pricePer) * parseFloat(i.qty)).toFixed(2)}`, style: 'fonts' },
      ]);
    } else {
      return [];
    }
  });


  const discountTotal = subTotal * (data.discount / 100);

  const discountSubTotal = subTotal - discountTotal;

  
  const order_sub_total =  discountSubTotal;

  const limitedLiability = 'Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com and in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product';




  return [
    {
      columns: [
        {
          stack: ['ACKNOWLEDGEMENT ']
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
          alignment: 'center'
        },
        {
          stack: [
            { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? 'Rush' : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            { text: `Est. Completion: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' },
            { text: `Ship Via: ${data.job_info.ShippingMethod ? data.job_info.ShippingMethod.NAME : ' '}`, alignment: 'right' },
            { text: `Salesmen: ${data.sale ? data.sale.fullName : ''}`, alignment: 'right' }
          ]
        }
      ]
    },
    {
      columns: [
        {
          stack: [
            { text: `Customer - ${data.job_info.customer.Company}` },
            { text: `${data.companyprofile.Contact ? data.companyprofile.Contact : ''}`, style: 'fonts' },
            { text: `${data.companyprofile.Address1 ? data.companyprofile.Address1 : ''}`, style: 'fonts' },
            {
              text: `${data.companyprofile.City}, ${data.job_info.State} ${data.job_info.Zip}`,
              style: 'fonts',
            },
            { text: `Ph: ${data.companyprofile.Phone1}`, style: 'fonts' },
            { text: `Fax: ${data.companyprofile.Fax ? data.companyprofile.Fax : ''}`, style: 'fonts' },
            { text: `Terms: ${data.companyprofile.PMT_TERMS ? data.companyprofile.PMT_TERMS : ''}`, style: 'fonts' },
          ],
        },
        {
          stack: [
            {
              text: `PO: ${
                data.job_info.poNum.length > 0 ? data.job_info.poNum : 'None'
              }`,
              alignment: 'left',
              margin: [0, 0, 0, 0],
            },
            {
              text: `Ship To: ${data.job_info.customer.Company}`,
              style: 'fonts',
              alignment: 'left',
              margin: [0, 0, 0, 0],
            },
            {
              text: `${data.job_info.Address1}`,
              alignment: 'left',
              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
            {
              text: `${data.job_info.Address2 ? data.job_info.Address2 : ''}`,
              alignment: 'left',
              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
            {
              text: `${data.job_info.City}, ${data.job_info.State} ${data.job_info.Zip}`,
              alignment: 'left',
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
              alignment: 'left',
              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
          ],
          margin: [120, 0, 0, 0],
        },
      ],
      margin: [0, 10],
    },
    {
      text:
        '==============================================================================',
      alignment: 'center',
    },
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
        body: tableBody
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
      margin: [0, 0, 0, 20]
    },
    {
      text:
        '==============================================================================',
      alignment: 'center',
    },
    {
      columns: [
        {
          text: ' ',
          style: 'fonts',
          width: 317,
        },
        { text: 'Order Subtotal', style: 'totals', margin: [0, 0, 0, 0], width: 120, alignment: 'right' },
        {
          text: `$${subTotal.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin:[0,0,0,10]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 317 },
        {
          text: `${data.discount > 0 ? data.discount + '% ' + 'Discount' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          alignment: 'right',
          width: 120
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
          alignment: 'right'
        },
        {
          text: `${data.discount > 0 ? '$' + discountSubTotal.toFixed(2) : ''}`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 0],
    },
    {
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
          alignment: 'right'
        },
        {
          text: `${data.tax > 0 ? '$' + data.tax.toFixed(2) : ''}`,
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
    {
      columns: [
        { text: '', style: 'totals', width: 317, decoration: 'underline' },
        {
          text: `${data.status === 'Quote' ? 'QUOTE ONLY' : 'TOTAL'}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          alignment: 'right',
          width: 120
        },
        {
          text: `$${data.total.toFixed(2)}`,
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
        { text: 'Minus Balance Paid:', style: 'totals', margin: [0, 0, 0, 0], width: 120,  alignment: 'right' },
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
        { text: 'BALANCE DUE:', style: 'totals', margin: [0, 0, 0, 0], width:105, alignment: 'right' },
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
          margin: [0,0,0,10]
        },
        { 
          text:
          limitedLiability.toUpperCase(),
          style: 'warrantyFont',
          alignment: 'left',
          margin: [0, 0, 0, 5],
        }
      ]
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
          text: ' ',
          style: 'fonts',
          alignment: 'right',
          margin: [0, 0, 0, 0],
        }
      ]

    },
  ];
};

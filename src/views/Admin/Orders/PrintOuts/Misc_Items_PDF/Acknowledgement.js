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
        { text: `$${i.price * i.qty}`, style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return tableBody.push([
        { text: i.qty, style: 'fonts' },
        { text: i.item2, style: 'fonts' },
        { text: i.pricePer, style: 'fonts' },
        { text: parseFloat(i.pricePer) * parseFloat(i.qty), style: 'fonts' },
      ]);
    } else {
      return [];
    }
  });


  const discountTotal = (subTotal * (data.discount / 100));

  const discountSubTotal = subTotal - (subTotal * (data.discount / 100));




  return [
    {
      columns: [
        {
          stack: ['Acknowledgement']
        },
        {
          stack: [
            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            { text: '203-888-6191', alignment: 'center' },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' }
          ]
        },
        {
          stack: [
            { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? 'Rush' : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            { text: `${data.status === 'Quote' ? '' : `Est. Completion: ${moment(data.job_info.DueDate).format(
              'MM/DD/YYYY'
            )}`}`, alignment: 'right' },
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
            { text: `${data.companyprofile.Contact}`, style: 'fonts' },
            { text: `${data.companyprofile.Address1}`, style: 'fonts' },
            { text: `${data.job_info.Address2 ? data.job_info.Address2 : ''}`, style: 'fonts' },
            {
              text: `${data.companyprofile.City}, ${data.job_info.State} ${data.job_info.Zip}`,
              style: 'fonts',
            },
            { text: `${data.companyprofile.Zip}`, style: 'fonts' },
            { text: `Ph: ${data.companyprofile.Phone1}`, style: 'fonts' },
            { text: `Fax: ${data.job_info.Fax ? data.job_info.Fax : ''}`, style: 'fonts' },
            { text: `Terms: ${data.job_info && data.job_info.customer &&  data.job_info.customer.PMT_TERMS ? data.job_info.customer.PMT_TERMS : ''}`, style: 'fonts' },
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
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
        body: tableBody
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return (i === node.table.headerRows) ? 1: 1;
        },
        vLineWidth: function (i) {
          return 0;
        },
        hLineColor: function (i) {
          return i === 1 ? 'black' : '#aaa';
        },
        paddingLeft: function (i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
          return (i === node.table.widths.length - 1) ? 0 : 8;
        },
      },
      margin: [0, 0, 0, 20]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Order Subtotal', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(subTotal).toFixed(2)}`, style: 'fonts', margin: [31, 0, 0, 0], alignment: 'right' }
      ]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        {
          text: data.Taxable
            ? '$' +
              discountSubTotal.toFixed(2) +
              ' x ' +
              data.companyprofile.TaxRate +
              '%' +
              ' Tax:'
            : '',
          style: 'totals',
          margin: [0, 0, 0, 0],
        },
        { text: `${data.tax > 0 ? '$' + data.tax.toFixed(2) : ''}`, style: 'fonts', alignment: 'right' },
      ],
      margin: [0, 10, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: `${data.discount>0 ? 'Discount' : ''}`, style: 'totals', margin: [0, 0, 0, 0] },
        { text: `${data.discount>0 ? data.discount + '%' : ''}`, style: 'fonts', alignment: 'right' }
      ],
      margin: [0, 0, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Quote Only:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.total).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 2, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Balance Paid:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(balancePaid).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 2, 0, 0],

    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Balance Due:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(balanceDue).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 15, 0, 0]
    },
    {
      text: 'Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com and in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product',
      style: 'warrantyFont',
      alignment: 'center',
      margin: [ 0, 25, 0, 0 ] 
    },
    // { text: '', pageBreak: 'before' }
  ];
};

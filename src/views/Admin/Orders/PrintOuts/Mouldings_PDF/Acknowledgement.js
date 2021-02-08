import moment from 'moment';

export default (data, breakdowns) => {

  const subTotal = data.subTotals;
  
  const balancePaid = data.balance_history.reduce(function (accumulator, balance) {
    return accumulator + balance.balance_paid;
  }, 0);

  const balanceDue = data.total - balancePaid;

  const tableBody = [
    [
      { text: 'Qty', style: 'fonts' },
      { text: 'Style', style: 'fonts' },
      { text: 'Material', style: 'fonts' },
      // { text: 'Thickness', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'Linear FT', style: 'fonts' },
      { text: 'Price', style: 'fonts' },
    ]
  ];


  data.mouldings.map(i  => {
    let feet = (i.item.MOULDING_WIDTH * 12) / 144;
    let waste = feet * 1.25;
    let multiplier = i.item.Multiplier;
    let wood = i.moulding_material ? i.moulding_material.STANDARD_GRADE : 0;
    let premium = 0;

    let a = waste * multiplier;


    // if(i.thickness.value === 0.75){
    //   wood = i.moulding_material ? i.moulding_material.STANDARD_GRADE : 0;
    // } else if (i.thickness.value === 1) {
    //   wood = i.moulding_material ? i.moulding_material.STANDARD_GRADE_THICK : 0;
    // } else {
    //   wood = 0;
    // }
      
    if(parseFloat(i.linearFT) > 0 && parseFloat(i.linearFT) <= 30) {
      premium = 3 + 1;
    } else if (parseFloat(i.linearFT) >= 31 && parseFloat(i.linearFT) <= 50) {
      premium = 2 + 1;
    } else if (parseFloat(i.linearFT) >= 51 && parseFloat(i.linearFT) <= 100) {
      premium = 1.75 + 1;
    } else if(parseFloat(i.linearFT) > 101 && parseFloat(i.linearFT) <= 250) {
      premium = 1.4 + 1;
    } else if (parseFloat(i.linearFT) > 251 && parseFloat(i.linearFT) <= 500) {
      premium = 1.1 + 1;
    } else {
      premium = 1 + 1;
    }

    let price = ((a * wood) * parseFloat(i.linearFT)) * premium;

    tableBody.push([
      { text: i.qty, style: 'fonts' },
      { text: i.style.name, style: 'fonts' },
      { text: i.moulding_material.NAME, style: 'fonts' },
      // { text: i.thickness.NAME, style: 'fonts' },
      { text: i.item.NAME, style: 'fonts' },
      { text: i.linearFT, style: 'fonts' },
      { text: `$${(price * parseInt(i.qty)).toFixed(2)}`, style: 'fonts' },
    ]);
  });




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
          stack : [
            {text: `Customer - ${data.job_info.customer.Company}`},
            {text: `${data.companyprofile.Contact}`, style: 'fonts'},
            {text: `${data.companyprofile.Address1}`, style: 'fonts'},
            {text: `${data.companyprofile.Address2}`, style: 'fonts'},
            {text: `${data.companyprofile.City}, ${data.job_info.State}`, style: 'fonts'},
            {text: `${data.companyprofile.Zip}`, style: 'fonts'},
            {text: `Ph: ${data.companyprofile.Phone1}`, style: 'fonts'},
            {text: `Fax: ${data.companyprofile.Fax}`, style: 'fonts'},
          ],
        },
        {
          stack: [
            { text: `PO: ${data.job_info.poNum.length>0 ? data.job_info.poNum : 'None'}`, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: `Ship To: ${data.job_info.customer.Company}`, style: 'fonts', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Address1}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Address2}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.City}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Zip}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.companyprofile.Phone1}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
          ]
        }
      ],
      margin: [0, 10]
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*', '*', '*'],
        body: tableBody
      },
      layout: 'lightHorizontalLines',
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
        { text: 'Tax:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.tax).toFixed(2)}`, style: 'fonts', alignment: 'right' }
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
    { text: '', pageBreak: 'before' }
  ];
};

import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';


export default (data, breakdowns) => {

  const qty = data.part_list.map((part, i) => {
    return part.dimensions.map((dim, index) => {
      return parseInt(dim.qty);
    }).reduce((acc, item) => acc + item, 0);
  });

  const subTotal = data.subTotals.reduce((acc, item) => acc + item, 0);
  
  const balancePaid = data.balance_history.reduce(function (accumulator, balance) {
    return accumulator + balance.balance_paid;
  }, 0);

  const balanceDue = data.total - balancePaid;

  const miscTotal = data.misc_items.map(i => {
    if(i.category === 'preselect'){
      return parseFloat(i.qty) * parseFloat(i.price)
    } else {
      return parseFloat(i.qty) * parseFloat(i.pricePer)
    }
  })

  const discountTotal = (subTotal * (data.discount / 100))

  const discountSubTotal = subTotal - (subTotal * (data.discount / 100))

  return [
    {
      columns: [
        {
          stack: ['Invoice']
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
            { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? "Rush" : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
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
    data.part_list.map((part, i) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'Notes', style: 'fonts' },
          { text: 'Total 1 Unit', style: 'fonts' },
          { text: 'Total Cost', style: 'fonts' },

        ]
      ];

      let sortedDimensions = part.dimensions.sort(function (a, b) { return a.item - b.item; });
      sortedDimensions.forEach((item, index) => {
        tableBody.push([
          { text: item.item, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          { text: `${item.notes ? item.notes : ''}`, style: 'fonts' },
          { text: `${(data.itemPrice[i][index]).toFixed(2)}`, style: 'fonts' },
          { text: `${(data.linePrice[i][index]).toFixed(2)}`, style: 'fonts', alignment: 'right' },
        ]);

      });

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `Drawer Box ${part.box_thickness.NAME}`,
                  style: 'fonts'
                },
                { text: `${part.box_woodtype.NAME}`, style: 'woodtype' }
              ]
            },
            {
              stack: [
                {
                  text: `${part.box_bottom_thickness.NAME} ${part.box_bottom_woodtype.NAME} Bottom`,
                  style: 'fonts'
                },
                {
                  text: `${part.box_finish.NAME}`,
                  style: 'fonts'
                },
                {
                  text: `${part.box_notch.NAME === 'Yes' ? 'Notch and Drilled' : ''}`,
                  style: 'fonts'
                }
              ],
              alignment: 'right'
            }
          ]
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
          ],
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            headerRows: 1,
            widths: [22, 75, 100, 100, 100, '*'],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        },
        {
          columns: [
            { text: ' Total: ', width: 129, style: 'totals', alignment: 'left' },
            { text: `${qty[i]}`, style: 'fonts', alignment: 'left' },
            {
              stack: [
                {
                  columns: [
                    { text: 'Additional Price', style: 'totals', margin: [0, 0, 0, 0], },
                    { text: `$${part.addPrice}`, style: 'totals', margin: [0, 0, 0, 0], alignment: 'right' }
                  ],
                  width: 100
                },
                {
                  columns: [
                    { text: 'Item Subtotal', style: 'totals', margin: [0, 0, 0, 0], },
                    { text: `$${(data.subTotals[i]).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
                  ]
                }
              ]
            }

          ],
          margin: [0, 10, 0, 5]
        },
        {
          stack: [
            { text: `Item Notes:  ${part.notes ? part.notes : ''}`, style: 'fonts'},
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
          margin: [0, 0, 0, 10]
        }
      ];
    }),
    {
      columns: [
        { text: `Total Number of Pieces: ${qty.reduce((acc, item) => acc + item, 0)}`, style: 'totals', width: 347 },
        { text: 'Order Subtotal', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(subTotal).toFixed(2)}`, style: 'fonts', margin: [31, 0, 0, 0], alignment: 'right' }
      ]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: `${data.discount>0 ? data.discount + '% ' + 'Discount' : ''}`, style: 'totals', margin: [0, 0, 0, 0] },
        { text: `${data.discount>0 ? '-' + '$' +  discountTotal.toFixed(2) : ''}`, style: 'fonts', alignment: 'right' }
      ],
      margin: [0, 0, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: `${data.discount>0 ? 'Discount Subtotal' : ''}`, style: 'totals', margin: [0, 0, 0, 0] },
        { text: `${data.discount>0 ? '$' +  discountSubTotal.toFixed(2) : ''}`, style: 'fonts', alignment: 'right' }
      ],
      margin: [0, 0, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: data.Taxable ? '$' + discountSubTotal.toFixed(2) + ' x ' + data.companyprofile.TaxRate + '%' + ' Tax:' : '', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.tax).toFixed(2)}`, style: 'fonts', alignment: 'right' }
      ],
      margin: [0, 10, 0, 0]
    },
    {
      columns: [
        { text: `${data.misc_items.length > 0 ? 'Misc Items' : ''}`, style: 'totals', width: 347, decoration: 'underline' },
        { text: '', style: 'totals', margin: [0, 0, 0, 0] },
        { text: '', style: 'totals', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 10, 0, 0]
    },
    {
      columns: [
        { text: data.misc_items.map(i => { return `(${i.qty ? i.qty : ''}) ${i.item ? i.item.NAME : i.item2 ? i.item2 : ''} \n`; }), style: 'fonts', width: 347 },
        { text: data.misc_items.map(i => { return `$${i.price ? i.price: i.pricePer ? i.pricePer : ''} \n`; }), style: 'fonts', margin: [0, 0, 0, 0] },
        { text: data.misc_items.map(i => { return `$${i.price ? i.price * parseFloat(i.qty) : i.pricePer ? parseFloat(i.pricePer) * parseFloat(i.qty) : ''} \n`; }), style: 'fonts', alignment: 'right' },
      ],
      margin: [0, 2, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
        { text: miscTotal.length > 0 ? 'Style Subtotal' : '', style: 'totals', margin: [0, 0, 0, 0] },
        { text: miscTotal.length > 0 ? '$' + miscTotal.reduce((acc, item) => acc + item, 0) : '', style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 10, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
        { text: `${data.status === 'Quote' ? 'Quote Only' : 'Total'}`, style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.total).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 10, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
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
      text: `Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com an in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product`,
      style: 'warrantyFont',
      alignment: 'center',
      margin: [ 0, 25, 0, 0 ] 
    },
  ];
};

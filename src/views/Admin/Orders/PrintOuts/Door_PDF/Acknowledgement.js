import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';
import numQty from 'numeric-quantity';


export default data => {

  const qty = data.part_list.map((part, i) => {
    return part.dimensions.map((dim, index) => {
      return parseInt(dim.qty);
    }).reduce((acc, item) => acc + item, 0);
  });



  const subTotal = data.subTotals.reduce((acc, item) => acc + item, 0);
  const balanceDue = data.balance_history[data.balance_history.length - 1].balance_due;
  const balancePaid = data.balance_history.reduce(function (accumulator, balance) {
    return accumulator + balance.balance_paid;
  }, 0);




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
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            { text: `Est. Ship: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' },
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
          
          margin: [0, 10]
        },
        {
          stack: [
            { text: `Job: ${data.job_info.jobName.length>0 ? data.job_info.jobName : 'None'}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `Ship To: ${data.job_info.customer.Company}`, style: 'fonts', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Address1}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Address2}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.City}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.job_info.Zip}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
            { text: `${data.companyprofile.Phone1}`, alignment: 'right', style: 'fonts', margin: [0, 0, 0, 0] },
          ]
        }

        
      ]
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },
    data.part_list.map((part, i) => {

      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Notes', style: 'fonts' },
          { text: 'Total 1 Unit', style: 'fonts' },
          { text: 'Total Cost', style: 'fonts' },

        ]
      ];


      part.dimensions.forEach((item, index) => {

        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
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
                { text: `${part.woodtype.NAME}`, style: 'fonts' },
                {
                  text: `${part.cope_design ? part.cope_design.NAME : part.mt_design ? part.mt_design.NAME + ' ' + part.construction.value : part.miter_design ? part.miter_design.NAME + ' ' + part.construction.value : part.miter_df_design ? part.miter_df_design.NAME + ' ' + part.construction.value : part.mt_df_design ? part.mt_df_design.NAME + ' ' + part.construction.value : part.construction.name} - ${part.panel ? part.panel.NAME : 'Glass'}`,
                  style: 'fonts'
                },
              ]
            },
            {
              stack: [
                { text: `IP: ${part.profile ? part.profile.NAME : ''}  Edge: ${part.edge ? part.edge.NAME : ''}`, style: 'fonts' },
                { text: `Applied Profile: ${part.applied_profile ? part.applied_profile.NAME : 'None'}`, style: 'fonts' }
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
            widths: [22, 75, 25, 175, 100, '*'],
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
            { text: `Item Notes:  ${part.notes? part.notes : ''}`, style: 'fonts'},
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
        { text: 'Order Subtoal', style: 'totals', margin: [0, 0, 0, 0] },
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
        { text: 'Discount:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `${data.discount}%`, style: 'fonts', alignment: 'right' }
      ],
      margin: [0, 0, 0, 0]
    },
    {
      columns: [
        { text: 'Misc Items', style: 'totals', width: 347, decoration: 'underline' },
        { text: `${data.status === 'Quote' ? 'Quote Only' : 'Total'}`, style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.total).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 2, 0, 0]
    },
    {
      columns: [
        { text: data.misc_items.map(i => { return `${i.item.NAME} - $${i.price} \n`; }), style: 'fonts', width: 347 },
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
    { text: '', pageBreak: 'before' }
  ];
};

import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';


export default data => {



  const qty = data.part_list.map((part, i) => {
    return part.dimensions.map((dim, index) => {
      return parseInt(dim.qty)
    }).reduce((acc, item) => acc + item, 0)
  })

  const subTotal = data.subTotals.reduce((acc, item) => acc + item, 0)



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
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            { text: `Est. Ship: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
          ]
        }
      ]
    },
    {
      columns: [
        {
          text: `${data.job_info.jobName} - ${data.job_info.customer.Company}`,
          margin: [0, 10]
        },
        { text: 'Job: None', alignment: 'right', margin: [0, 0, 80, 0] }
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
          { text: 'Total 1 Unit', style: 'fonts' },
          { text: 'Total Cost', style: 'fonts' },

        ]
      ];


      part.dimensions.forEach((item, index) => {

        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
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
                { text: `${part.woodtype.NAME}`, style: 'fonts' }
              ]
            },
            {
              stack: [
                { text: `IP: ${part.profile ? part.profile.NAME : ''} NO HINGE  Edge: ${part.edge ? part.edge.NAME : ''}`, style: 'fonts' },
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
            widths: [22, 75, 200, 100, '*'],
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
        { text: 'Quote Only:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.total).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 2, 0, 0]
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Balance Paid:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: '-$0.00', style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 2, 0, 0],

    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'Balance Due:', style: 'totals', margin: [0, 0, 0, 0] },
        { text: `$${(data.total).toFixed(2)}`, style: 'fonts', margin: [0, 0, 0, 0], alignment: 'right' }
      ],
      margin: [0, 15, 0, 0]
    },
    // { text: '', pageBreak: 'before' }
  ];
};

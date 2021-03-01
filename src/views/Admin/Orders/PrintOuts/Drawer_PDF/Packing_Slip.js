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
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
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
            { text: `${data.companyprofile.Contact}`, style: 'fonts' },
            { text: `${data.companyprofile.Address1}`, style: 'fonts' },
            { text: `${data.job_info.Address2 ? data.job_info.Address2 : ''}`, style: 'fonts' },
            {
              text: `${data.companyprofile.City}, ${data.job_info.State}`,
              style: 'fonts',
            },
            { text: `${data.companyprofile.Zip}`, style: 'fonts' },
            { text: `Ph: ${data.companyprofile.Phone1}`, style: 'fonts' },
            { text: `Fax: ${data.job_info.Fax ? data.job_info.Fax : ''}`, style: 'fonts' },
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
              text: `${data.job_info.City}`,
              alignment: 'left',
              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
            {
              text: `${data.job_info.Zip}`,
              alignment: 'left',
              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
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
    data.part_list.map((part, i) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Style', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size', style: 'fonts' },

        ]
      ];

      let sortedDimensions = part.dimensions.sort(function (a, b) { return a.item - b.item; });
      sortedDimensions.forEach((item, index) => {
        tableBody.push([
          { text: item.item, style: 'fonts' },
          { text: `Drawer Box ${part.box_thickness.NAME}`, style: 'fonts'},
          { text: `${item.qty}`, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
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
                  text: `${i.box_notch && i.box_notch.NAME === 'Yes - Add in Misc Items' ? 'Notch and Drilled' : ''}`,
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
            widths: [22, '*', '*', '*'],
            body: tableBody,
          },
          layout: 'lightHorizontalLines',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 10],
        },
      ];
    }),
    {
      columns: [
  
        {
          text: `Payment Method: ${data.job_info && data.job_info.PaymentMethod && data.job_info.PaymentMethod.NAME}`,
          style: 'totals',
          width: 347,
        },
        {
          text: 'Checked By: ______________________________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
        
      columns: [
        {
          text: `Ship Via: ${data.job_info && data.job_info.ShippingMethod && data.job_info.ShippingMethod.NAME}`,
          style: 'totals',
          width: 347,
        },
  
        {
          text: 'Packed By:  ______________________________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: `Total Number of Pieces: ${qty.reduce(
            (acc, item) => acc + item,
            0
          )}`,
          style: 'totals',
          width: 347,
        },
  
        {
          text: 'Total Weight: _____________________________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 347,
        },
        {
          text: 'Received In Good Condition: ______________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 347,
        },
        {
          text: 'Total #: __________________________________________',
          style: 'totals',
          width: 347,
        },
  
      ],
      margin: [0, 0, 0, 10],
    },
  ];
};

import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles'


export default data => {
  return data.part_list.map((i, index) => {

    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Length', style: 'fonts' },
        // { text: '' }
      ]
    ];
    i.dimensions.forEach((item, index) => {
      console.log(item)

      tableBody.push([
        { text: index + 1, style: 'fonts' },
        { text: `${i.design.NAME}`, style: 'fonts' },
        { text: Stiles(item, i).map(stile => { return `${stile.qty} \n` }), style: 'fonts' },
        { text: Stiles(item, i).map(stile => { return `${stile.measurement} \n` }), style: 'fonts' },
        // { text: '' }
      ]);
    });

    return [
      {
        columns: [
          {
            stack: ['Individual - STILES List', `Shipping Date: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`,]
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
              { text: `Est. Ship: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
            ]
          }
        ]
      },
      {
        columns: [
          {
            text: `${data.jobInfo.jobName} - ${data.jobInfo.customer.Company}`,
            margin: [0, 10]
          },
          { text: 'Job: None', alignment: 'right', margin: [0, 0, 80, 0] }
        ]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
      },
      [
        {
          margin: [0, 10, 0, 0],
          columns: [
            { text: `${i.woodtype.NAME}`, style: 'woodtype' },
            {
              text: `IP: ${i.moulds.NAME}`,
              style: 'woodtype',
              alignment: 'left'
            },
            {
              text: '',
              alignment: 'left'
            },
            {
              text: '',
              alignment: 'left'
            },
            {
              text: 'STILES',
              alignment: 'right',
              style: 'woodtype'
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
            widths: ['*', '*', '*', '*'],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
        }
      ],

      { text: '', pageBreak: 'before' }
    ];

  })


};

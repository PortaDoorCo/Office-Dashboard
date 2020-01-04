import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels';
import Size from '../Breakdowns/Doors/Size';


export default data => {
  return [
    {
      columns: [
        {
          stack: [

            { text: 'Assembly List', bold: true },
            `Shipping Date: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`,
            { qr: `${data.id}`, fit: '75', margin: [0, 5, 0, 0] },
          ]
        },
        {
          stack: [

            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            { text: '203-888-6191', alignment: 'center' },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
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
    data.part_list.map((i, index) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'WxH', style: 'fonts' },
          { text: 'Stile', style: 'fonts' },
          { text: 'Rails', style: 'fonts' },
          { text: 'Panels WxH', style: 'fonts' },
          { text: 'Cab #', style: 'fonts' }
        ]
      ];

    

      i.dimensions.forEach((item, index) => {
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item), style: 'fonts' },
          { text: Stiles(item, i).map(stile => { return `(${stile.qty}) ${stile.measurement} - ${stile.pattern} \n` }), style: 'fonts' },
          { text: Rails(item, i).map(rail => { return `(${rail.qty}) ${rail.measurement} - ${rail.pattern} \n` }), style: 'fonts' },
          { text: Panels(item, i), style: 'fonts' },
          ' '
        ]);
      });

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `${i.design.NAME} - ${i.panels.PANEL}`,
                  style: 'fonts'
                },
                { text: `${i.woodtype.NAME}`, style: 'woodtype' }
              ]
            },
            {
              stack: [
                { text: 'Thickness: 3/4"', style: 'fonts' },
                {
                  text: `IP: ${i.moulds.NAME}   Edge: ${i.edges.NAME}`,
                  style: 'fonts'
                }
              ],
              alignment: 'right'
            }
          ]
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }
          ],
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            headerRows: 1,
            widths: [22, 15, 50, 120, 110, 100, 27],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
        }
      ];
    }),
    { text: '', pageBreak: 'before' }
  ];
};

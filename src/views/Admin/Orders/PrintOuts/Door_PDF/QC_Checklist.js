import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';

export default (data, breakdowns) => {
  return [
    {
      columns: [
        {
          stack: ['QC Check Off Sheet']
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
    data.part_list.map((i, index) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'CHK', style: 'fonts' },
          { text: 'L/R', style: 'fonts' },
          { text: 'Build Instruction', style: 'fonts' },
        ]
      ];

      i.dimensions.forEach((item, index) => {
        // Panels(item, i, breakdowns);
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item), style: 'fonts' },
          { text: '[      ]', style: 'fonts' },
          { text: 'N/A', style: 'fonts' },
          { text: '    ', style: 'fonts' },
        ]);
      });

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                { text: `${i.woodtype.NAME}`, style: 'fontsBold' }
              ]
            },
            {
              stack: [
                { text: `Panel: ${i.panel ? i.panel.NAME : 'Glass'}`, style: 'fonts' },
                { text: `IP: ${i.profile ? i.profile.NAME : 'None'}`, style: 'fonts' },
                { text: `Finish: ${i.finish.NAME}`, style: 'fonts' },
                { text: `Edge: ${i.edge ? i.edge.NAME : 'None'}`, style: 'fonts' },
                { text: 'No Hinge', style: 'fonts' },
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
            widths: [22, 15, 75, 100, 100, '*'],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
          margin: [0, 0, 0, 10]
        }
      ];
    }),
    { text: '', pageBreak: 'before' }
  ];
};

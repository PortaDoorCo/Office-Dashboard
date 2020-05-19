import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import Size from '../Breakdowns/Doors/Size';


export default (data, breakdowns) => {

  
console.log(data)

console.log("BBBBBBBRRREEAAAKKJ", breakdowns)


  return [
    {
      columns: [
        {
          stack: [

            { text: 'Assembly List', bold: true },
            `Shipping Date: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`,
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

      console.log(data)


      

      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'WxH', style: 'fonts' },
          { text: 'Stile', style: 'fonts' },
          { text: 'Rails', style: 'fonts' },
          { text: 'Panels WxH', style: 'fonts' }
        ]
      ];



      i.dimensions.forEach((item, index) => {
        // console.log('BRSKAJSFDSDKLJ',breakdowns)
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item), style: 'fonts' },
          { text: Stiles(item, i, breakdowns).map(stile => { return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n` }), style: 'fonts' },
          { text: Rails(item, i, breakdowns).map(rail => { return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${item.full_frame ? '** Full Frame DF **' : ''}` }), style: 'fonts' },
          { text: Panels(item, i, breakdowns).map(panel => { return `${panel.qty} ${panel.measurement} - ${panel.pattern} \n` }), style: 'fonts' },
        ]);
      });

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `${i.orderType.name}`,
                  style: 'fonts'
                },
                {
                  text: `${i.design ? i.design.NAME + ' ' + i.construction.value : i.construction.name} - ${i.panel ? i.panel.NAME : 'Glass'}`,
                  style: 'fonts'
                },
                { text: `${i.woodtype.NAME}`, style: 'woodtype' }
              ]
            },
            {
              stack: [
                { text: `Thickness: ${i.thickness.name}"`, style: 'fonts' },
                {
                  text: `IP: ${i.profile ? i.profile.NAME : ''}   Edge: ${i.edge ? i.edge.NAME : ''}`,
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
            widths: [22, 15, 80, 115, 105, 120],
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

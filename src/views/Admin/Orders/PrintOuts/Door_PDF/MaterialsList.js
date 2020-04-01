import moment from 'moment';
// import Panels from '../Breakdowns/Panels';


export default data => {
  return [
    {
      columns: [
        {
          stack: ['Materials List']
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

    {
      columns: [
        {
          text: "MATERIAL BREAKDOWN"
        },
      ],
      margin: [0, 10, 0, 20]
    },
    {
      columns: [
        { text: "Total Number of Doors: 14", style: 'fonts' }
      ]
    },
    {
      columns: [
        { text: "Total Number of Solid DF: 0", style: 'fonts' }
      ],
      margin: [0, 0, 0, 20]
    },
    {
      columns: [
        { text: "Total SQ FT of Doors: 105.58", style: 'fonts' }
      ],
      margin: [0, 0, 0, 20]
    },
    data.part_list.map((i, index) => {
      return [
        {
          columns: [
            { text: `Linear Feet of 2 3/8" Sapele 4/4 - 3/4" Thickness Needed: 49.19`, style: 'fonts', width: 400 },
            { text: `Add 20 % Waster: `, style: 'fonts', width: 100 },
            { text: `59.0`, style: 'fonts', width: 30 }
          ],

        }
      ]
    }),
    {
      columns: [
        { text: "" }
      ],
      margin: [0, 5, 0, 5]
    },
    data.part_list.map((i, index) => {
      return [
        {
          columns: [
            { text: `Board Feet of Sapele 4/4 - 3/4" Thickness Stile/Rail/Mullion Material Needed: 9.74`, style: 'fonts', width: 400 },
            { text: `Add 20 % Waster: `, style: 'fonts', width: 100 },
            { text: `59.0`, style: 'fonts', width: 30 }
          ],

        }
      ]
    }),
    {
      columns: [
        { text: "" }
      ],
      margin: [0, 5, 0, 5]
    },
    data.part_list.map((i, index) => {
      return [
        {
          columns: [
            { text: `Board Feet of Sapele 4/4 O Panel - 3/4" Thickness Panel Material Needed: 9.74`, style: 'fonts', width: 400 },
            { text: `            `, style: 'fonts', width: 100 },
            { text: `59.0`, style: 'fonts', width: 30 }
          ],
        }
      ]
    }),
    {
      columns: [
        { text: "Hinges Needed", style: 'fonts', decoration: 'underline' }
      ],
      margin: [0, 20, 0, 0]
    },



    { text: '', pageBreak: 'before' },
  ];
};

import moment from 'moment';
import LinearFT from '../../Breakdowns/Doors/MaterialBreakdown/LinearFT';
import BoardFT from '../../Breakdowns/Doors/MaterialBreakdown/BoardFT';
import Panels from '../../Breakdowns/Doors/Panels/Panels';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import SqFT from '../../Breakdowns/Doors/MaterialBreakdown/SqFT';

export default (data,breakdowns) => {
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
            { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? "Rush" : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            { text: `Est. Completion: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
          ]
        }
      ]
    },
    {
      columns: [
        {
          text: `${data.job_info.customer.Company}`,
        },
        {
          stack: [
            { text: `PO: ${data.job_info.poNum}`, alignment: 'right', }
          ]
        },
      ],
      margin: [0, 10]
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },

    {
      columns: [
        {
          text: 'MATERIAL BREAKDOWN'
        },
      ],
      margin: [0, 10, 0, 20]
    },
    {
      columns: [
        { text: `Total Number of Doors: ${TotalPieces(data)}`, style: 'fonts' }
      ]
    },
    // {
    //   columns: [
    //     { text: 'Total Number of Solid DF: 0', style: 'fonts' }
    //   ],
    //   margin: [0, 0, 0, 20]
    // },
    {
      columns: [
        { text: `Total SQ FT of Doors: ${SqFT(data)}`, style: 'fonts' }
      ],
      margin: [0, 0, 0, 20]
    },
    data.part_list.map((i, index) => {
      return [
        {
          columns: [
            { text: `Linear Feet of ${i.dimensions[0].leftStile}" ${i.woodtype.NAME} - ${i.thickness.name}" Thickness Needed: ${LinearFT(i.dimensions)}`, style: 'fonts', width: 400 },
            { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
            { text: `${((parseFloat(LinearFT(i.dimensions)) * 0.2) + parseFloat(LinearFT(i.dimensions))).toFixed(2)}`, style: 'fonts', width: 30 }
          ],

        }
      ];
    }),
    {
      columns: [
        { text: '' }
      ],
      margin: [0, 5, 0, 5]
    },
    data.part_list.map((i, index) => {

      const bf = parseFloat(BoardFT(i.dimensions));
      const percent = bf * 0.2;

      const equation = (bf + percent).toFixed(2);

      if (i.orderType.value === 'One_Piece') {
        return [];
      } else {
        return [
          {
            columns: [
              { text: `Board Feet of ${i.woodtype.NAME} - ${i.thickness.name}" Thickness - Stile/Rail/Mullion Material Needed: ${BoardFT(i.dimensions)}`, style: 'fonts', width: 400 },
              { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
              { text: equation, style: 'fonts', width: 30 }
            ],

          }
        ];
      }


    }),
    {
      columns: [
        { text: '' }
      ],
      margin: [0, 5, 0, 5]
    },
    data.part_list.map((i, index) => {

      const qty = i.dimensions.map((item,index) => {
        return parseInt(item.qty);
      });

      const width = i.dimensions.map((item,index) => {
       
        return Panels(item, i, breakdowns).map(panel => { return panel.width; });
      });

      const height = i.dimensions.map((item,index) => {
       
        return Panels(item, i, breakdowns).map(panel => { return panel.height; });
      });

      const widthTotal = width.map(i => {
        return i.reduce((acc, item) => acc + item);
      });
      const heightTotal = height.map(i => {
        return i.reduce((acc, item) => acc + item, 0);
      });

      const qtyTotal = qty.reduce((acc, item) => acc + item);

      const equation = (((widthTotal.reduce((acc, item) => acc + item)) * (heightTotal.reduce((acc, item) => acc + item))) / 144) * qtyTotal;

      if (i.orderType.value === 'One_Piece') {
        return [];
      }

      if (i.panel){
        return [
          {
            columns: [
              { text: `Board Feet of ${i.woodtype.NAME} -  - ${i.thickness.name}" Thickness Panel Material Needed: ${equation.toFixed(2)}`, style: 'fonts', width: 400 },
              { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
              { text: ((equation * 0.2) + equation).toFixed(2), style: 'fonts', width: 30 }
            ],
          }
        ];
      } else {
        return [];
      }

    }),
    {
      columns: [
        // { text: 'Hinges Needed', style: 'fonts', decoration: 'underline' }
      ],
      margin: [0, 20, 0, 0]
    }
  ];
};

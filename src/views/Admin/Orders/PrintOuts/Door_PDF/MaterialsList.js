import moment from 'moment';
import { flattenDeep, uniq, uniqBy, flatten } from 'lodash';
import LinearFT from '../Breakdowns/Doors/MaterialBreakdown/LinearFT';
import BoardFT from '../Breakdowns/Doors/MaterialBreakdown/BoardFT';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import TotalPieces from '../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import SqFT from '../Breakdowns/Doors/MaterialBreakdown/SqFT';
import numQty from 'numeric-quantity';

export default (data, breakdowns) => {
  console.log(
    'heydceddd==>>>',
    uniq(
      (data.part_list.map(i => i.dimensions.map(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.width, j.height])))
    )
  );

  const uniques = uniq(
    flattenDeep(data.part_list.map(i => i.dimensions.map(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile])))
  );

  const flattenedItems= flatten(data.part_list.map(i => i.dimensions));
  console.log('finallll==>>', uniques.map(i => {
    return {
      [i]: flattenedItems.filter(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile].includes(i))
    };
  }));

  console.log(
    'hesssydceddd==>>>',
    flatten(data.part_list.map(i => i.dimensions))//.filter((e) => uniques.some(f => [e.topRail, e.bottomRail, e.leftStile, e.rightStile].includes(f))), 'item')
    
  );

  /*uniq(
    flattenDeep(data.part_list.map(i => i.dimensions.map(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile])))
  )
  */

  return [
    {
      columns: [
        {
          stack: ['Materials List'],
        },
        {
          stack: [
            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            { text: '203-888-6191', alignment: 'center' },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
          ],
        },
        {
          stack: [
            {
              text:
                data.job_info.Rush && data.job_info.Sample
                  ? 'Sample / Rush'
                  : data.job_info.Rush
                    ? 'Rush'
                    : data.job_info.Sample
                      ? 'Sample'
                      : '',
              alignment: 'right',
              bold: true,
            },
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            {
              text: `Est. Completion: ${moment(data.job_info.DueDate).format(
                'MM/DD/YYYY'
              )}`,
              alignment: 'right',
            },
          ],
        },
      ],
    },
    {
      columns: [
        {
          text: `${data.job_info.customer.Company}`,
        },
        {
          stack: [{ text: `PO: ${data.job_info.poNum}`, alignment: 'right' }],
        },
      ],
      margin: [0, 10],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    },

    {
      columns: [
        {
          text: 'MATERIAL BREAKDOWN',
        },
      ],
      margin: [0, 10, 0, 20],
    },
    {
      columns: [
        { text: `Total Number of Doors: ${TotalPieces(data)}`, style: 'fonts' },
      ],
    },
    // {
    //   columns: [
    //     { text: 'Total Number of Solid DF: 0', style: 'fonts' }
    //   ],
    //   margin: [0, 0, 0, 20]
    // },
    {
      columns: [
        { text: `Total SQ FT of Doors: ${SqFT(data)}`, style: 'fonts' },
      ],
      margin: [0, 0, 0, 20],
    },

    // map thru the part listen
    // map thru the dimensions
    // check the leftStile with rightStile
    // check the topRail with bottomRail

    // if its all the same = pick out width = 2 5/16

    // then go next line item
    // check the leftStile with rightStile
    // check the topRail with bottomRail
    // if its all the same = pick out width = 1 1/2

    // [2 5/16 , 1 1/2]

    // display

   

    data.part_list.map((i, index) => {
      // i.dimensions.map(j => {
      //   console.log({j});
      // });

      
      /*(e) =>
      [e.leftStile === e.rightStile].join() &&
      [e.leftStile === e.topRail].join() &&
      [e.leftStile === e.bottomRail].join() &&
      //[e.rightStile === e.leftStile].join() &&
      [e.rightStile === e.topRail].join() &&
      [e.rightStile === e.bottomRail].join() &&
      [e.topRail === e.bottomRail].join() 
      //[e.topRail === e.leftStile].join()&&
      //[e.topRail === e.rightStile].join()*/

      if (i.dimensions[0].leftStile) {
        return [
          {
            columns: [
              {
                text: `Linear Feet of ${i.dimensions[0].leftStile}" ${
                  i.woodtype.NAME
                } - ${i.thickness.name}" Thickness Needed: ${LinearFT(
                  i.dimensions
                )}`,
                style: 'fonts',
                width: 400,
              },
              { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
              {
                text: `${(
                  parseFloat(LinearFT(i.dimensions)) * 0.2 +
                  parseFloat(LinearFT(i.dimensions))
                ).toFixed(2)}`,
                style: 'fonts',
                width: 60,
              },
            ],
          },
        ];
      } else {
        return [];
      }
    }),
    {
      columns: [{ text: '' }],
      margin: [0, 5, 0, 5],
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
              {
                text: `Board Feet of ${i.woodtype.NAME} - ${
                  i.thickness.name
                }" Thickness - Stile/Rail/Mullion Material Needed: ${BoardFT(
                  i.dimensions
                )}`,
                style: 'fonts',
                width: 400,
              },
              { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
              { text: equation, style: 'fonts', width: 60 },
            ],
          },
        ];
      }
    }),
    {
      columns: [{ text: '' }],
      margin: [0, 5, 0, 5],
    },
    data.part_list.map((i, index) => {
      const width = i.dimensions.map((item, index) => {
        const width = Panels(item, i, breakdowns).map((panel) => {
          return numQty(panel.width);
        });
        const height = Panels(item, i, breakdowns).map((panel) => {
          return numQty(panel.height);
        });
        const q = ((width * height) / 144) * parseInt(item.qty);
        return q;
      });

      const equation = width.reduce((acc, item) => acc + item);

      if (
        i.orderType.value === 'One_Piece' ||
        i.orderType.value === 'One_Piece_DF' ||
        i.orderType.value === 'Two_Piece' ||
        i.orderType.value === 'Two_Piece_DF'
      ) {
        return [];
      }

      if (i.panel) {
        return [
          {
            columns: [
              {
                text: `Board Feet of ${i.woodtype.NAME} -  - ${
                  i.thickness.name
                }" Thickness Panel Material Needed: ${equation.toFixed(2)}`,
                style: 'fonts',
                width: 400,
              },
              { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
              {
                text: (equation * 0.2 + equation).toFixed(2),
                style: 'fonts',
                width: 60,
              },
            ],
          },
        ];
      } else {
        return [];
      }
    }),
    {
      columns: [
        // { text: 'Hinges Needed', style: 'fonts', decoration: 'underline' }
      ],
      margin: [0, 20, 0, 0],
    },

    { text: '', pageBreak: 'before' },
  ];
};

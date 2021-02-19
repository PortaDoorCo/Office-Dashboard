import moment from 'moment';
import { flattenDeep, uniq, flatten } from 'lodash';
import LinearFT from '../../Breakdowns/Doors/MaterialBreakdown/LinearFT';
import BoardFT from '../../Breakdowns/Doors/MaterialBreakdown/BoardFT';
import Panels from '../../Breakdowns/Doors/Panels/Panels';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import SqFT from '../../Breakdowns/Doors/MaterialBreakdown/SqFT';
import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (data, breakdowns) => {

  //flatten part list
  const flattenedParts= flatten(data.part_list);

  //unique items
  const uniques_items = uniq(
    flattenDeep(data.part_list.map(i => i.woodtype.NAME))
  );

  //unique thickness
  const uniques_thickness = uniq(
    flattenDeep(data.part_list.map(i => i.thickness.name))
  );

  //map items -> map thickness -> return object
  const b = uniques_items.map(i => {
    return uniques_thickness.map(h => {
      return {
        parts: flattenedParts.filter(j => [j.woodtype.NAME].includes(i)).filter(g => [g.thickness.name].includes(h)),
        woodtype: i,
        thickness: h,
        widths: uniq(
          flattenDeep(data.part_list.map(i => i.dimensions.map(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.horizontalMidRailSize, j.verticalMidRailSize])))
        )
      };
    });
  });

  //map b -> final array of objects
  const c = b.map(i => {
    return i.map(j => {
      return {
        parts: j.widths.filter(n => n !== 0).map(k => {
          // const flattenedItems= flatten(j.parts.map(i => i.dimensions));
          console.log({k});
          return {
            width: k,
            thickness: j.thickness,
            woodtype: j.woodtype,
            parts: j.parts.map(f => {
              return {
                width: k,
                thickness: j.thickness,
                woodtype: j.woodtype,
                part: f,
                items: flatten(f.dimensions).filter(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.horizontalMidRailSize, j.verticalMidRailSize].includes(k))
              };
            }),
            // items: flattenedItems.filter(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.horizontalMidRailSize, j.verticalMidRailSize].includes(k))
          };
        })
      };
    });
  });

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
    //map C -> map i -> map j -> return array
    c.map((i, index) => {
      return i.map(j => {
        return j.parts.map(n => {
          console.log({n});
          return [
            {
              columns: [
                {
                  //linear FT
                  text: `Linear Feet of ${fraction(parseFloat(LinearFT(n.parts, breakdowns, n.width).width))}" ${
                    n.woodtype
                  } - ${n.thickness}" Thickness Needed: ${LinearFT(
                    n.parts, breakdowns, n.width
                  ).sum}`,
                  style: 'fonts',
                  width: 400,
                },
                { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
                {
                  text: `${(
                    parseFloat(LinearFT(n.parts, breakdowns, n.width).sum) * 0.2 +
                    parseFloat(LinearFT(n.parts, breakdowns, n.width).sum)
                  ).toFixed(2)}`,
                  style: 'fonts',
                  width: 60,
                },
              ],
            },
          ];
        });
      });
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

      console.log({i});

      if (i && i.panel) {
        return [
          {
            columns: [
              {
                text: `Board Feet of ${i.woodtype.NAME} - ${
                  i.thickness.name
                }" Thickness ${i.panel.NAME} Material Needed: ${equation.toFixed(2)}`,
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

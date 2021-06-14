import moment from 'moment';
import { flattenDeep, uniq, flatten, groupBy, uniqBy, _ } from 'lodash';
import LinearFT from '../Breakdowns/Doors/MaterialBreakdown/LinearFT';
import BoardFT from '../Breakdowns/Doors/MaterialBreakdown/BoardFT';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import TotalPieces from '../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import SqFT from '../Breakdowns/Doors/MaterialBreakdown/SqFT';
import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (data, breakdowns) => {

  //flatten part list
  const flattenedParts= flatten(data.part_list);

  //unique woodtype
  const uniques_items = uniq(
    flattenDeep(data.part_list.map(i => i.woodtype.NAME))
  );

  //unique thickness
  const uniques_thickness = uniq(
    flattenDeep(data.part_list.map(i => i.thickness.name))
  );

  console.log({uniques_thickness});

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
  const c = flattenDeep(b).map(j => {
    return {
      parts: j.widths.filter(n => n !== 0).map(k => {
        console.log({k});



        return {
          width: k,
          thickness: j.thickness,
          woodtype: j.woodtype,
          parts: j.parts.map(f => {

            console.log({aaaa: flatten(f.dimensions).filter(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.horizontalMidRailSize, j.verticalMidRailSize].includes(k))});

            return {
              width: k,
              thickness: j.thickness,
              woodtype: j.woodtype,
              part: f,
              items: flatten(f.dimensions).filter(j => [j.topRail, j.bottomRail, j.leftStile, j.rightStile, j.horizontalMidRailSize, j.verticalMidRailSize].includes(k))
            };
          }),
        };
      })
    };
  });

  const d = flattenDeep(c).map((j, index) => {



    return j.parts.map(n => {

      console.log({n});

      return LinearFT(n.parts,breakdowns,n.width).map(b => {
        if(numQty(b.width) > 0) {
          return {
            width: numQty(b.width) === 2.376 ? 2.375 : numQty(b.width),
            woodtype: n.woodtype,
            thickness: n.thickness,
            linearFT: parseFloat(b.sum),
            waste: parseFloat(b.sum) * 0.2 + parseFloat(b.sum)
          };
        } else {
          return [];
        }            
      });
       
    });

  });


  const flattenD = flattenDeep(d);

  console.log({flattenD: flattenD});
  console.log({testtttt: uniq(flattenD)});

  const flattenD2 = flattenD.filter(i => i.width === 2.375);
  const flattenD3 = groupBy(flattenD2, 'woodtype');


  console.log({flattenD3});
  

  const flattenD4 = Object.entries(flattenD3).map(([k, v]) => {

    console.log({k});

    console.log({v});

    return {...v[0], width: v[0].width, linearFT: v.reduce((a,b) => a + b.linearFT, 0), waste: v.reduce((a,b) => a + b.waste, 0), woodtype: v[0].woodtype,  };
  });

  console.log({flattenD4});

  const flattenD5 = flattenD.filter(item => item.width !== 2.375);


  console.log({flattenD5});



  const flattenD6 = flattenD4.concat(flattenD5);

  console.log({flattenD6});

  const flattenD7 = flattenD6.sort((a, b) => (a.waste > b.waste) ? -1 : 1);


  const LinearFTDisplay = flattenD7.map((i, index) => {

    return [
      {
        columns: [
          {
            //linear FT
            text: `Linear Feet of ${fraction(i.width)}" ${
              i.woodtype
            } - ${i.thickness}" Thickness Needed: ${i.linearFT}`,
            style: 'fonts',
            width: 400,
          },
          { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
          {
            text: `${(i.waste).toFixed(2)}`,
            style: 'fonts',
            width: 60,
          },
        ],
      },
    ];

  });


  const BoardFTArr = flattenD.map((i, index) => {
    return {
      BoardFT: ((i.width / 12) * i.linearFT),
      woodtype: i.woodtype,
      thickness: i.thickness,
      waste: (((i.width / 12) * i.linearFT) * 0.2) + ((i.width / 12) * i.linearFT)
    };
  });

  const BoardFT_Total = Object.entries(groupBy(BoardFTArr, 'woodtype')).map(([k,v]) => ({...v[0], BoardFT: v.reduce((a,b) => a + b.BoardFT, 0)}));


  const BoardFTDisplay = BoardFT_Total.map(i => {

    console.log({i});

    return [
      {
        columns: [
          {
            text: `Board Feet of ${i.woodtype} - ${
              (i.thickness === '4/4 Standard Grade') || (i.thickness === '4/4 Select Grade')  ? '4/4' : (i.thickness === '5/4 Standard Grade') || (i.thickness === '5/4 Select Grade')  ? '5/4' : null
            }" Thickness - Stile/Rail/Mullion Material Needed: ${i.BoardFT.toFixed(2)}`,
            style: 'fonts',
            width: 400,
          },
          { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
          { text: ((i.BoardFT * 0.2) + i.BoardFT).toFixed(2), style: 'fonts', width: 60 },
        ],
      },
    ];
  });

  
  const PanelBoardFTCalc = data.part_list.map((i, index) => {
    const calc = i.dimensions.map((item, index) => {
      const width = Panels(item, i, breakdowns).map((panel) => {

        console.log({panel});

        return numQty(panel.width);
      });
      const height = Panels(item, i, breakdowns).map((panel) => {
        return numQty(panel.height);
      });

      const qty = Panels(item, i, breakdowns).map((panel) => {
        if(panel.count){
          return panel.count;
        } else {
          return 0;
        }
      });

      const width_total = width.reduce((acc, item) => acc + item);
      const height_total = height.reduce((acc, item) => acc + item);
      const qty_total = qty.reduce((acc, item) => acc + item);


      console.log({qty});
      console.log({width});
      console.log({height});

      const q = ((width_total * height_total) / 144) * parseInt(qty_total ? qty_total : 0);

      console.log({q});

      return q;
    });

    console.log({calc});

    const equation = calc.reduce((acc, item) => acc + item);

    console.log({equation});

    if (
      i.orderType.value === 'One_Piece' ||
      i.orderType.value === 'One_Piece_DF' ||
      i.orderType.value === 'Two_Piece' ||
      i.orderType.value === 'Two_Piece_DF' ||
      i.orderType.value === 'Slab_Door' ||
      i.orderType.value === 'Slab_DF' ||
      i.construction.value === 'Slab' || 
      i.door_piece_number?.pieces === (1 || 2)
    ) {
      return 0;
    } else {
      return {
        orderType: i.orderType.value,
        BoardFT: equation,
        waste: (equation * 0.2 + equation),
        woodtype: i.woodtype.NAME,
        thickness: i.thickness.value,
        panel: i.panel
      };
    }


  });
  const PanelBoardFT_Total = Object.entries(groupBy(flatten(PanelBoardFTCalc), 'woodtype')).map(([k,v]) => ({...v[0], BoardFT: v.reduce((a,b) => a + b.BoardFT, 0)}));
  const PanelBoardFTDisplay = PanelBoardFT_Total.map((i, index) => {
    if (i && i.panel) {
      return [
        {
          columns: [
            {
              text: `${i.panel.Flat ? 'Square' : 'Board'} Feet of ${i.woodtype} - ${
                i.thickness === 0.75 ? '4/4' : i.thickness === 1 ? '5/4' : null
              }" Thickness ${i.panel.NAME} Material Needed: ${i.BoardFT.toFixed(2)}`,
              style: 'fonts',
              width: 400,
            },
            { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
            {
              text: ((i.BoardFT * 0.2) + i.BoardFT).toFixed(2),
              style: 'fonts',
              width: 60,
            },
          ],
        },
      ];
    } else {
      return [];
    }
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
              text: `Estimated Ship: ${moment(data.job_info.DueDate).format(
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
          style: 'fonts'
        },
        {
          stack: [{ text: `PO: ${data.job_info.poNum}`, alignment: 'right', style: 'fonts' }],
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
        // { text: 'Total Number of Solid DF: Still Need To Be Calculated', style: 'fonts' },
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

    //Linear FT Here
    LinearFTDisplay,




    {
      columns: [{ text: '' }],
      margin: [0, 5, 0, 5],
    },
    
    BoardFTDisplay,


    {
      columns: [{ text: '' }],
      margin: [0, 5, 0, 5],
    },

    PanelBoardFTDisplay,


    {
      columns: [
        // { text: 'Hinges Needed', style: 'fonts', decoration: 'underline' }
      ],
      margin: [0, 20, 0, 0],
    },
    // { text: '', pageBreak: 'before' }
  ];
};

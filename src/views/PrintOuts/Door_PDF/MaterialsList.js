import Ratio from 'lb-ratio';
import { flatten, flattenDeep, groupBy, uniq, uniqBy } from 'lodash';
import moment from 'moment';
import numQty from 'numeric-quantity';
import LinearFT from '../Breakdowns/Doors/MaterialBreakdown/LinearFT';
import SqFT from '../Breakdowns/Doors/MaterialBreakdown/SqFT';
import TotalPieces from '../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import TotalSolidDFs from '../Breakdowns/Doors/MaterialBreakdown/TotalSolidDFs';
import Panels from '../Breakdowns/Doors/Panels/Panels';

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (data, breakdowns) => {
  // const newData = data.part_list.map((i) => {
  //   return {
  //     ...i,
  //     dimensions: i.dimensions.map((v) => {
  //       return {
  //         ...v,
  //         construction: i.construction,
  //         profile: i.profile,
  //         design: i.design,
  //         edge: i.edge,
  //         panel: i.panel,
  //         orderType: i.orderType,
  //         VERTICAL_GRAIN: i.VERTICAL_GRAIN
  //       };
  //     }),
  //   };
  // });

  //flatten part list
  const flattenedParts = flatten(data.part_list);

  //unique woodtype
  const uniques_items = uniq(
    flattenDeep(data.part_list.map((i) => i.woodtype.NAME))
  );

  //unique thickness
  const uniques_thickness = uniq(
    flattenDeep(data.part_list.map((i) => i.thickness.name))
  );

  //map items -> map thickness -> return object
  const b = uniques_items.map((i) => {
    return uniques_thickness.map((h) => {
      return {
        parts: flattenedParts
          .filter((j) => [j.woodtype.NAME].includes(i))
          .filter((g) => [g.thickness.name].includes(h)),
        woodtype: i,
        thickness: h,
        widths: uniq(
          flattenDeep(
            data.part_list.map((i) =>
              i.dimensions.map((j) => [
                numQty(j.topRail),
                numQty(j.bottomRail),
                numQty(j.leftStile),
                numQty(j.rightStile),
                numQty(j.horizontalMidRailSize),
                numQty(j.verticalMidRailSize),
              ])
            )
          )
        ),
      };
    });
  });

  const c = flattenDeep(b).map((j) => {
    return {
      parts: j.widths
        .filter((n) => n !== 0)
        .map((k) => {
          return {
            width: k,
            thickness: j.thickness,
            woodtype: j.woodtype,
            parts: j.parts.map((f) => {
              return {
                width: k,
                thickness: j.thickness,
                woodtype: j.woodtype,
                part: f,
                items: flatten(f.dimensions).filter((j) =>
                  [
                    numQty(j.topRail),
                    numQty(j.bottomRail),
                    numQty(j.leftStile),
                    numQty(j.rightStile),
                    numQty(j.horizontalMidRailSize),
                    numQty(j.verticalMidRailSize),
                  ].includes(k)
                ),
              };
            }),
          };
        }),
    };
  });

  const d = flattenDeep(c).map((j, index) => {
    return j.parts.map((n) => {
      return LinearFT(n.parts, breakdowns, n.width).map((b) => {
        if (numQty(b.width) > 0) {
          return {
            width: numQty(b.width) === 2.376 ? 2.375 : numQty(b.width),
            woodtype: n.woodtype,
            thickness: n.thickness,
            linearFT: parseFloat(b.sum),
            waste: parseFloat(b.sum) * 0.2 + parseFloat(b.sum),
          };
        } else {
          return [];
        }
      });
    });
  });

  const flattenD = flattenDeep(d);

  const flattenD2 = flattenD.filter((i) => i.width === 2.375);
  const flattenD3 = groupBy(flattenD2, 'woodtype');

  const flattenD4 = Object.entries(flattenD3).map(([k, v]) => {
    return {
      ...v[0],
      width: v[0].width,
      linearFT: v.reduce((a, b) => a + b.linearFT, 0),
      waste: v.reduce((a, b) => a + b.waste, 0),
      woodtype: v[0].woodtype,
    };
  });

  const flattenD5 = flattenD.filter((item) => item.width !== 2.375);

  const flattenD6 = flattenD4.concat(flattenD5);

  const flattenD7 = flattenD6.sort((a, b) => (a.waste > b.waste ? -1 : 1));

  const d8 = uniqBy(flattenD7, 'width');

  const LinearFTDisplay = d8.map((i, index) => {
    return [
      {
        columns: [
          {
            //linear FT
            text: `Linear Feet of ${fraction(i.width)}" ${i.woodtype} - ${
              i.thickness
            }" Thickness Needed: ${i.linearFT?.toFixed(2)}`,
            style: 'fonts',
            width: 400,
          },
          { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
          {
            text: `${i.waste.toFixed(2)}`,
            style: 'fonts',
            width: 60,
          },
        ],
      },
    ];
  });

  const BoardFTArr = flattenD.map((i, index) => {
    return {
      BoardFT: (i.width / 12) * i.linearFT,
      woodtype: i.woodtype,
      thickness: i.thickness,
      waste: (i.width / 12) * i.linearFT * 0.2 + (i.width / 12) * i.linearFT,
    };
  });

  const BoardFT_Total = Object.entries(groupBy(BoardFTArr, 'woodtype')).map(
    ([k, v]) => ({ ...v[0], BoardFT: v.reduce((a, b) => a + b.BoardFT, 0) })
  );

  const BoardFTDisplay = BoardFT_Total.map((i) => {
    return [
      {
        columns: [
          {
            text: `Board Feet of ${i.woodtype} - ${
              i.thickness.includes('4/4')
                ? '4/4'
                : i.thickness.includes('5/4')
                ? '5/4'
                : '6/4'
            }" Thickness - Stile/Rail/Mullion Material Needed: ${i.BoardFT.toFixed(
              2
            )}`,
            style: 'fonts',
            width: 400,
          },
          { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
          {
            text: (i.BoardFT * 0.2 + i.BoardFT).toFixed(2),
            style: 'fonts',
            width: 60,
          },
        ],
      },
    ];
  });

  const PanelBoardFTCalc = data.part_list.map((i, index) => {
    const calc = i.dimensions.map((item, index) => {
      const width = (Panels(item, i, breakdowns) || [{ width: 0 }]).map(
        (panel) => {
          return numQty(panel.width);
        }
      );
      const height = (Panels(item, i, breakdowns) || [{ height: 0 }]).map(
        (panel) => {
          return numQty(panel.height);
        }
      );

      const qty = (Panels(item, i, breakdowns) || [{ qty: 0 }]).map((panel) => {
        if (panel.count) {
          return panel.count;
        } else {
          return panel.qty;
        }
      });

      const width_total = (width || [0]).reduce((acc, item) => acc + item);
      const height_total = (height || [0]).reduce((acc, item) => acc + item);
      const qty_total = (qty || [0]).reduce((acc, item) => acc + item);

      const q =
        ((width_total * height_total) / 144) *
        parseInt(qty_total ? qty_total : 0);

      return q;
    });

    const equation = calc.reduce((acc, item) => acc + item);

    if (
      i.orderType.value === 'One_Piece' ||
      i.orderType.value === 'One_Piece_DF' ||
      i.orderType.value === 'Slab_Door' ||
      i.orderType.value === 'Slab_DF' ||
      i.construction.value === 'Slab' ||
      i.panel.name === 'Glass'
    ) {
      return {
        orderType: i.orderType.value,
        BoardFT: 0,
        waste: 0,
        woodtype: i.woodtype.NAME,
        thickness: i.thickness.name,
        panel: i.panel,
      };
    } else {
      return {
        orderType: i.orderType.value,
        BoardFT: equation,
        waste: equation * 0.2 + equation,
        woodtype: i.woodtype.NAME,
        thickness: i.thickness.name,
        panel: i.panel,
      };
    }
  });
  const PanelBoardFT_Total = Object.entries(
    groupBy(flatten(PanelBoardFTCalc), 'woodtype')
  ).map(([k, v]) => {
    let totalBoardFt = 0;
    let panel;

    v.map((j, k) => {
      if (!j.panel || j.panel?.NAME === 'Glass') {
        return null;
      } else {
        totalBoardFt += j.BoardFT;
        panel = j.panel;
      }
      return null;
    }).filter((x) => x);

    return {
      ...v[0],
      panel,
      BoardFT: totalBoardFt,
    };
  });

  const PanelBoardFTDisplay = PanelBoardFT_Total.map((i, index) => {
    if (i && i.panel) {
      return [
        {
          columns: [
            {
              text: `${i.panel.Flat ? 'Square' : 'Board'} Feet of ${
                i.woodtype
              } - ${
                i.thickness.includes('4/4')
                  ? '4/4'
                  : i.thickness.includes('5/4')
                  ? '5/4'
                  : '6/4'
              }" Thickness ${i.panel.NAME} Material Needed: ${i.BoardFT.toFixed(
                2
              )}`,
              style: 'fonts',
              width: 400,
            },
            { text: 'Add 20 % Waste: ', style: 'fonts', width: 100 },
            {
              text: (i.BoardFT * 0.2 + i.BoardFT).toFixed(2),
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
          stack: [
            { text: 'Materials List', bold: true },
            { qr: `${data.id}`, fit: '75', margin: [0, 5, 0, 0] },
          ],
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
            { text: `Order #: ${data.id + 100}`, alignment: 'right' },
            {
              text: `Due Date: ${
                data.Shipping_Scheduled
                  ? `${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
                  : 'TBD'
              }`,
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
          style: 'fonts',
        },
        {
          stack: [
            {
              text: `PO: ${data.job_info.poNum}`,
              alignment: 'right',
              style: 'fonts',
            },
          ],
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
        {
          alignment: 'center',
          style: 'fontsBold',
          stack: [
            data.job_info?.Shop_Notes
              ? {
                  text: `${
                    data.job_info?.Shop_Notes
                      ? data.job_info?.Shop_Notes?.toUpperCase()
                      : ''
                  }`,
                }
              : null,
            {
              text: data.misc_items.map((i) => {
                if (i.category === 'preselect') {
                  if (
                    i?.item?.NAME?.toLowerCase()?.includes('delivery') ||
                    i?.item?.NAME?.toLowerCase()?.includes('price') ||
                    i?.item?.NAME?.toLowerCase()?.includes('discount') ||
                    i?.item?.NAME?.toLowerCase()?.includes('credit') ||
                    i?.item?.NAME?.toLowerCase()?.includes('rush')
                  ) {
                    return null;
                  } else {
                    return `${i.item?.NAME} \n`;
                  }
                } else {
                  if (
                    i?.item2?.toLowerCase()?.includes('delivery') ||
                    i?.item2?.toLowerCase()?.includes('price') ||
                    i?.item2?.toLowerCase()?.includes('discount') ||
                    i?.item2?.toLowerCase()?.includes('credit') ||
                    i?.item2?.toLowerCase()?.includes('rush')
                  ) {
                  } else {
                    return `${i.item2} \n`;
                  }
                }
              }),
            },
          ],
        },
        {
          text: '',
        },
      ],
      margin: [0, 10, 0, 20],
    },
    {
      columns: [
        {
          text: `Total Number of Doors: ${
            TotalPieces(data) - TotalSolidDFs(data)
          }`,
          style: 'fonts',
        },
      ],
    },
    TotalSolidDFs(data) > 0
      ? {
          columns: [
            {
              text: `Total Number of Solid DF: ${TotalSolidDFs(data)}`,
              style: 'fonts',
            },
          ],
          margin: [0, 0, 0, 10],
        }
      : null,
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

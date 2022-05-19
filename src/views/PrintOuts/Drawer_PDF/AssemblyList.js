import _ from 'lodash';
import Bottoms from '../Breakdowns/DrawerBoxes/Bottoms';
import Fronts from '../Breakdowns/DrawerBoxes/Fronts';
import LinearFT from '../Breakdowns/DrawerBoxes/LinearFT';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import Sides from '../Breakdowns/DrawerBoxes/Sides';
import Size from '../Breakdowns/DrawerBoxes/Size';
import SQFT from '../Breakdowns/DrawerBoxes/SQFT';

export default (data, breakdowns) => {
  let itemNum = 0;

  return [
    data.part_list.map((i, index) => {
      const info = [];

      const tableBody = [];

      const materialBody = [];

      const itemize = i.dimensions.map((i) => {
        itemNum += 1;
        return {
          ...i,
          item: itemNum,
        };
      });

      const groupedByHeight = _.groupBy(itemize, 'height');

      Object.entries(groupedByHeight).map(([k, v], lineIn) => {
        const groupedInfoBody = [
          {
            margin: [0, 0, 0, 0],
            columns: [
              {
                stack: [
                  {
                    text: `Drawer Box ${i.box_thickness.NAME}`,
                    style: 'woodtype',
                  },
                  { text: `${i.woodtype.NAME}`, style: 'woodtype' },
                ],
              },
              {
                text: `${i.notes ? i.notes.toUpperCase() : ''}`,
                style: 'fontsBold',
                alignment: 'center',
              },
              {
                stack: [
                  { text: ' ' },
                  {
                    text: `${i.box_bottom_thickness.NAME} ${i.box_bottom_woodtype.NAME} Bottom`,
                    style: 'woodtype',
                  },
                ],
                alignment: 'right',
              },
            ],
          },

          {
            text: '==============================================================================',
            alignment: 'center',
          },
        ];

        const groupedTableBody = [
          [
            { text: 'Item', style: 'fonts' },
            { text: 'Qty', style: 'fonts' },
            { text: 'Finish Box Size (WxDxH)', style: 'fonts' },
            { text: 'Qty Box Sides', style: 'fonts' },
            { text: 'Qty Box Fronts/Backs', style: 'fonts' },
            { text: 'Box Bottoms', style: 'fonts' },
          ],
        ];

        const groupedMaterialBody = [];

        v.forEach((item, index) => {
          let tb = [
            { text: item.item ? item.item : index + 1, style: 'fonts' },
            { text: item.qty, style: 'fonts' },
            {
              stack: [
                { text: Size(item), style: 'fonts' },
                {
                  text: `${item.notes ? item.notes.toUpperCase() : ''}`,
                  style: 'tableBold',
                  margin: [0, 4, 0, 0],
                },
              ],
            },
            {
              text: `${Sides(item, i, breakdowns).qty} - ${
                Sides(item, i, breakdowns).measurement
              }`,
              style: 'fonts',
            },
            {
              text: `${Fronts(item, i, breakdowns).qty} - ${
                Fronts(item, i, breakdowns).measurement
              }`,
              style: 'fonts',
            },
            {
              stack: [
                {
                  text: `${Bottoms(item, i, breakdowns).qty} - ${
                    Bottoms(item, i, breakdowns).measurement
                  }`,
                  style: 'fonts',
                },
                item.cab_number
                  ? {
                      text: `Cab#: ${item.cab_number ? item.cab_number : ''}`,
                      style: 'tableBold',
                      alignment: 'left',
                    }
                  : null,
              ],
            },
          ];

          groupedTableBody.push(tb);
        });

        let mb = {
          columns: [
            { text: `${i.woodtype.NAME}`, style: 'fonts' },
            { text: `${k} x ${i.box_thickness.NAME}`, style: 'fonts' },
            { text: `${SQFT(v, i, breakdowns)} Sq FT`, style: 'fonts' },
            { text: `${LinearFT(v, i, breakdowns)} Lin FT`, style: 'fonts' },
            { text: `${LinearIN(v, i, breakdowns)} Lin IN`, style: 'fonts' },
            { text: '', style: 'fonts' },
          ],
        };

        return (
          info.push(groupedInfoBody),
          tableBody.push(groupedTableBody),
          groupedMaterialBody.push(mb),
          materialBody.push(groupedMaterialBody)
        );
      });

      let table = tableBody.map((i, k) => {
        return [
          {
            stack: [
              index === 0 && k === 0
                ? {
                    columns: [
                      { text: '' },
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
                                  i?.item?.NAME?.toLowerCase()?.includes(
                                    'delivery'
                                  ) ||
                                  i?.item?.NAME?.toLowerCase()?.includes(
                                    'price'
                                  ) ||
                                  i?.item?.NAME?.toLowerCase()?.includes(
                                    'discount'
                                  )
                                ) {
                                  return null;
                                } else {
                                  return `${i.item?.NAME} \n`;
                                }
                              } else {
                                if (
                                  i?.item2
                                    ?.toLowerCase()
                                    ?.includes('delivery') ||
                                  i?.item2?.toLowerCase()?.includes('price') ||
                                  i?.item2?.toLowerCase()?.includes('discount')
                                ) {
                                } else {
                                  return `${i.item2} \n`;
                                }
                              }
                            }),
                          },
                        ],
                      },
                      { text: '' },
                    ],
                    margin: [0, -26, 0, 10],
                  }
                : null,
              info[k],
              {
                table: {
                  headerRows: 1,
                  widths: [22, 15, 105, 112, 112, 95],
                  body: i,
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return i === 1 ? 1 : 0;
                  },
                  vLineWidth: function (i, node) {
                    return 0;
                  },
                  hLineStyle: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                      return null;
                    }
                    return { dash: { length: 1, space: 1 } };
                  },
                  paddingLeft: function (i) {
                    return i === 0 ? 0 : 8;
                  },
                  paddingRight: function (i, node) {
                    return i === node.table.widths.length - 1 ? 0 : 8;
                  },
                },
              },
              {
                text: '==============================================================================',
                alignment: 'center',
              },
            ],
          },
        ];
      });

      const materialBreakdown = materialBody.map((i, index) => {
        return i;
      });

      let body = [
        table,
        {
          text: 'Box Sides / Box Fronts & Backs - Material Breakdown',
          style: 'fonts',
          margin: [0, 12, 0, 0],
        },
        {
          text: '==============================================================================',
          alignment: 'center',
        },
        materialBreakdown,
        {
          text: '==============================================================================',
          alignment: 'center',
        },
      ];

      return body;
    }),
    // { text: '', pageBreak: 'before' }
  ];
};

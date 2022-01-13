import _ from 'lodash';
import numQty from 'numeric-quantity';
import Bottoms from '../Breakdowns/DrawerBoxes/Bottoms';
import Size from '../Breakdowns/DrawerBoxes/Size';

export default (data, breakdowns) => {
  let itemNum = 0;

  return [
    data.part_list.map((i, index) => {
      const itemize = i.dimensions.map((i) => {
        itemNum += 1;
        return {
          ...i,
          item: itemNum,
        };
      });

      let sortedDimensions = itemize.sort(function (a, b) {
        return numQty(b.width) - numQty(a.width);
      });

      const bottoms = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Finish Box Size', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Drawer Bottom Size', style: 'fonts' },
        ],
      ];
      sortedDimensions.forEach((item, index) => {
        bottoms.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          { text: item.qty, style: 'fonts' },
          { text: Size(item, i), style: 'fonts' },
          { text: Bottoms(item, i, breakdowns).qty, style: 'fonts' },
          { text: Bottoms(item, i, breakdowns).measurement, style: 'fonts' },
        ]);
      });

      const materialBody = [];

      const length = i.dimensions.map((item) => {
        return {
          length: Bottoms(item, i, breakdowns).length,
          width: item.width,
          qty: item.qty,
        };
      });

      const groupedByDepth = _.groupBy(length, 'length');

      Object.entries(groupedByDepth).map(([k, v]) => {
        let total_widths = 0;

        for (let item of v) {
          total_widths += numQty(item.width) * parseInt(item.qty);
        }

        const groupedMaterialBody = [];

        const length = numQty(k);

        let waste = total_widths * 1.3;

        let sheetSize =
          i.box_bottom_woodtype?.NAME === 'Baltic Birch' ? 42 : 49;

        let rips = Math.ceil(waste / sheetSize);
        let percentage_of_sheet = (length * rips) / 78;

        let mb = {
          columns: [
            {
              text: `${i.box_bottom_thickness.NAME} ${i.box_bottom_woodtype.NAME} Bottom`,
              style: 'fonts',
            },
            { text: `${k}`, style: 'fonts' },
            { text: rips, style: 'fonts' },
            { text: percentage_of_sheet.toFixed(2), style: 'fonts', width: 50 },
            {
              text: `Sheets ${i.box_bottom_thickness.NAME} ${i.box_bottom_woodtype.NAME} Bottom`,
              style: 'fonts',
            },
          ],
        };

        return (
          groupedMaterialBody.push(mb), materialBody.push(groupedMaterialBody)
        );
      });

      return [
        {
          stack: [
            index === 0 && data.job_info?.Shop_Notes
              ? {
                columns: [
                  { text: '' },
                  {
                    text: `${
                        data.job_info?.Shop_Notes
                          ? data.job_info?.Shop_Notes?.toUpperCase()
                          : ''
                    }`,
                    alignment: 'center',
                    style: 'fontsBold',
                  },
                  { text: '' },
                ],
                margin: [0, -26, 0, 0],
              }
              : null,
            {
              margin: [0, 10, 0, 0],
              columns: [
                {
                  stack: [
                    {
                      text: `${i.box_bottom_thickness.NAME} ${i.box_bottom_woodtype.NAME} Bottom`,
                      style: 'woodtype',
                    },
                  ],
                },
                {
                  text: `Notes: ${i.notes ? i.notes.toUpperCase() : ''}`,
                  style: 'fontsBold',
                  alignmen: 'right',
                },
              ],
            },
            {
              text: '==============================================================================',
              alignment: 'center',
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 40, 180, 30, '*'],
                body: bottoms,
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
              margin: [0, 0, 0, 10],
            },

            {
              text: '==============================================================================',
              alignment: 'center',
            },
            {
              columns: [
                {
                  text: 'Material',
                  style: 'fonts',
                  decoration: 'underline',
                },
                { text: 'Length', style: 'fonts', decoration: 'underline' },
                { text: 'Rips', style: 'fonts', decoration: 'underline' },
                { text: '', style: 'fonts', width: 50 },
                { text: '', style: 'fonts' },
              ],
            },
            materialBody,
          ],
        },
      ];
    }),
  ];
};

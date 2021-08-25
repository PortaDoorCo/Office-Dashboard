import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';
import Sides from '../Breakdowns/DrawerBoxes/Sides';
import Fronts from '../Breakdowns/DrawerBoxes/Fronts';
import Bottoms from '../Breakdowns/DrawerBoxes/Bottoms';
import _ from 'lodash';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import LinearFT from '../Breakdowns/DrawerBoxes/LinearFT';
import SQFT from '../Breakdowns/DrawerBoxes/SQFT';

export default (data, breakdowns) => {
  return [
    {
      headlineLevel: 1,
      columns: [
        {
          stack: [
            { text: 'ASSEMBLY LIST', bold: true },
            `Shipping Date: ${moment(data.job_info.DueDate).format(
              'MM/DD/YYYY'
            )}`,
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
      stack: [
        { text: `${data.orderNum}`, style: 'orderNum' },
        {
          columns: [
            {
              stack: [
                { text: `${data.job_info.customer.Company}` },
              ],
            },
            // {
            //   stack: [
            //     {
            //       stack: data.misc_items.map((i) =>
            //         i.item?.NAME.includes('Clear Finish')
            //           ? 'Clear Finish'
            //           : i.item?.NAME.includes('Notch')
            //             ? 'Notch and Drilled'
            //             : ''
            //       ),
            //       alignment: 'center',
            //       style: 'fontsBold',
            //     },
            //     {
            //       stack: data.part_list.map((i) => {
            //         const fingerpull = i.dimensions.filter((j) =>
            //           j.scoop?.NAME.includes('Yes')
            //         );
            //         const fingerpull_items = fingerpull.map((k) => k.item);

            //         if (fingerpull.length > 0) {
            //           return { text: `Fingerpull - Item# ${fingerpull_items}` };
            //         } else {
            //           return null;
            //         }
            //       }),
            //       alignment: 'center',
            //       style: 'fontsBold',
            //     },
            //   ],
            // },

            {
              text: `${data.job_info.Shop_Notes.toUpperCase()}`,
              alignment: 'center'
            },
            { text: `PO: ${data.job_info.poNum.toUpperCase()}`, alignment: 'right' },
          ],
        },
      ],
      margin: [0, 0, 0, 0],
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    data.part_list.map((i) => {
      const info = [];

      const tableBody = [];

      const materialBody = [];

      const itemize = i.dimensions.map((j, k) => ({...j, item: k + 1}));

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
              { text: `${i.notes ? i.notes.toUpperCase() : ''}`, style: 'fontsBold', alignment: 'center' },
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
                  text: `${item.notes ? item.notes.toUpperCase() : ''} ${
                    item.full_frame ? 'Full Frame DF' : ''
                  } ${item.lite ? item.lite.NAME : ''}`,
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

      let table = tableBody.map((i, index) => {
        return [
          info[index],
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

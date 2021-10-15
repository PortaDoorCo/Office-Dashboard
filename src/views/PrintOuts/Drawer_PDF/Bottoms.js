import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';
import Bottoms from '../Breakdowns/DrawerBoxes/Bottoms';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import _ from 'lodash';
import numQty from 'numeric-quantity';

export default (data, breakdowns) => {
  return [
    {
      columns: [
        {
          stack: [
            { text: 'BOTTOMS LIST', bold: true },
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
              text: `${data.job_info?.Shop_Notes ? data.job_info?.Shop_Notes?.toUpperCase() : ''}`,
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
    data.part_list.map((i, index) => {
      let sortedDimensions = i.dimensions.map((j, k) => ({...j, item: k + 1 })).sort(function (a, b) {
        return b.width - a.width;
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
        return { length: Bottoms(item, i, breakdowns).length, width: item.width, qty: item.qty };
      });


      const groupedByDepth = _.groupBy(length, 'length');



      Object.entries(groupedByDepth).map(([k, v]) => {

        let total_widths = 0;

        for(let item of v){
          total_widths += (numQty(item.width) * parseInt(item.qty));
        }

        console.log({k});
        console.log({v});
        console.log({i});

        const groupedMaterialBody = [];

        const length = numQty(k);

        console.log({total_widths});

        let waste = total_widths * 1.3;

        let sheetSize = i.box_bottom_woodtype?.NAME === 'Baltic Birch' ? 42 : 49;



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
            { text: `Sheets ${i.box_bottom_thickness.NAME} ${i.box_bottom_woodtype.NAME} Bottom`, style: 'fonts' },
          ],
        };

        return (
          groupedMaterialBody.push(mb), materialBody.push(groupedMaterialBody)
        );
      });

      return [
        {
          margin: [0, 0, 0, 0],
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
              alignmen: 'right'
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
              decoration: 'underline'
            },
            { text: 'Length', style: 'fonts', decoration: 'underline' },
            { text: 'Rips', style: 'fonts', decoration: 'underline' },
            { text: '', style: 'fonts', width: 50  },
            { text: '', style: 'fonts' },
          ],
        },
        materialBody,
      ];
    }),
  ];
};

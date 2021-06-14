import moment from 'moment';
import Sides from '../Breakdowns/DrawerBoxes/Sides';
import Fronts from '../Breakdowns/DrawerBoxes/Fronts';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import _ from 'lodash';


export default (data, breakdowns) => {
  return [
    {
      columns: [
        {
          stack: [
            { text: 'Sides/Fronts/Backs List', bold: true },
            `Shipping Date: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
          ]
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
            { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? 'Rush' : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
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
        { text: `PO: ${data.job_info.poNum}`, alignment: 'right' }
      ],
      margin: [0, 10]
    },
    {
      text:
        '==============================================================================',
      alignment: 'center',
    },
    data.part_list.map((i, index) => {
      let sortedDimensions = i.dimensions.sort(function (a, b) { return a.height - b.height; });
      let sortedQty = sortedDimensions.sort(function (a, b) { return a.qty - b.qty; });
      const fronts = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Piece Type', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Size', style: 'fonts' },

        ]
      ];
      sortedQty.forEach((item, index) => {

        fronts.push([
          { text: item.item, style: 'fonts' },
          { text: Fronts(item, i, breakdowns).pattern, style: 'fonts' },
          { text: Fronts(item, i, breakdowns).qty, style: 'fonts' },
          { text: Fronts(item, i, breakdowns).measurement, style: 'fonts' },
        ]);
      });
      const sides = [
        [
          { text: '', style: 'fonts' },
          { text: '', style: 'fonts' },
          { text: '', style: 'fonts' },
          { text: '', style: 'fonts' },

        ]
      ];
      sortedQty.forEach((item, index) => {
        sides.push([
          { text: item.item, style: 'fonts' },
          { text: Sides(item, i, breakdowns).pattern, style: 'fonts' },
          { text: Sides(item, i, breakdowns).qty, style: 'fonts' },
          { text: Sides(item, i, breakdowns).measurement, style: 'fonts' },
        ]);
      });

      const materialBody = [];


      const groupedByHeight = _.groupBy(i.dimensions, 'height');
      Object.entries(groupedByHeight).map(([k, v], lineIn) => {

        const groupedMaterialBody = [];

        return v.forEach((item, index) => {


          let mb = {
            columns: [
              { text: `${i.woodtype.NAME}`, style: 'fonts' },
              { text: `${k} x ${i.box_thickness.NAME}`, style: 'fonts' },
              { text: `= ${LinearIN(v, i, breakdowns)} Lin IN`, style: 'fonts' },
              { text: '', style: 'fonts' },
            ]
          };
          return (groupedMaterialBody.push(mb),
          materialBody.push(groupedMaterialBody));

        });

      });

      return [
        {
          headlineLevel: 1,
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                { text: `${i.woodtype.NAME}`, style: 'woodtype' },
                { text: `Notes: ${i.notes ? i.notes : ''}`, style: 'fontsBold' },
              ]
            },
            {
              stack: [
                {
                  text: `${i.box_thickness.NAME} Box Side`,
                  style: 'woodtype'
                },
                {
                  text: `${i.box_notch.NAME === 'Yes - Add in Misc Items' ? 'Notch and Drilled' : ''}`,
                  style: 'fonts'
                }
              ],
              alignment: 'right'
            }
          ]
        },
        {
          text:
            '==============================================================================',
          alignment: 'center',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*',],
            body: fronts
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
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*',],
            body: sides
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
          text:
            '==============================================================================',
          alignment: 'center',
        },
        {
          text: 'Box Sides / Box Fronts & Backs - Linear Inch Material Breakdown - "Width x Thickness"', style: 'fonts', margin: [0, 12, 0, 0],
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
        },
        materialBody,
        {
          text:
            '==============================================================================',
          alignment: 'center',
        },
        // { text: '', pageBreak: 'before' }
      ];
    })
  ];
};

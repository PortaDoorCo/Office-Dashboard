import moment from 'moment';
import Sides from '../Breakdowns/DrawerBoxes/Sides';
import Fronts from '../Breakdowns/DrawerBoxes/Fronts';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import _ from 'lodash';
import numQty from 'numeric-quantity';


export default (data, breakdowns) => {

  let itemNum = 0;

  return [

    data.part_list.map((i, index) => {

      const itemize = i.dimensions.map(i => {
        itemNum += 1;
        return {
          ...i,
          item: itemNum
        };
      });

      let sortedDimensions = itemize.sort(function (a, b) { return numQty(a.height) - numQty(b.height); });
      let sortedQty = sortedDimensions.sort(function (a, b) { return parseInt(a.qty) - parseInt(b.qty); });
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
          { text: item.item ? item.item : index + 1, style: 'fonts' },
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
          { text: item.item ? item.item : index + 1, style: 'fonts' },
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
          } : null,
        {
          headlineLevel: 1,
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                { text: `${i.woodtype.NAME}`, style: 'woodtype' },
              ]
            },
            { text: `${i.notes ? i.notes.toUpperCase() : ''}`, style: 'fontsBold', alignment: 'center' },
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

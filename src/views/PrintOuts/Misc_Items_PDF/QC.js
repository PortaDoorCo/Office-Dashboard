import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import Size from '../Breakdowns/Doors/Size';
import SlabSize from '../Breakdowns/Doors/SlabSize';
import GlassSort from '../Sorting/GlassSort';


export default (data, breakdowns) => {

  const tableBody = [
    [
      { text: 'Line', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'QTY', style: 'fonts' },
      { text: 'CHK', style: 'fonts' },
    ],
  ];

  const t = data.misc_items?.forEach((i, index) => {

    if(i.category === 'preselect') {
      return tableBody.push([
        { text: index + 1, style: 'fonts' },
  
        { text: i.item.NAME, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
        { text: '[      ]', style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return tableBody.push([
        { text: index + 1, style: 'fonts' },
  
        { text: i.item2, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
        { text: '[      ]', style: 'fonts' },
      ]);
    } else {
      return [];
    }

  });



  return [
    
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
        body: tableBody,
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
    // { text: '', pageBreak: 'before' }
  ];
};

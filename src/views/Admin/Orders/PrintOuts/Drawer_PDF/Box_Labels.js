import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size';


export default (data, breakdowns) => {

  return [
    {
      margin: [-21,8, -11,8],
      table: {
        alignment: 'center',
        widths: [170, 170, 170],
        heights: [60, 60,60, 60, 60, 60, 60, 60, 60, 60],
        body: [
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
          [{text : 'mylabel1', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel2', alignment:'center', margin: [0,25,0,0]}, {text : 'mylabel3', alignment:'center', margin: [0,25,0,0]}],
        ]
      },
      layout: {
        //hLineWidth: function(i, node) {
        //  return (i === 0 || i === node.table.body.length) ? 2 : 1;
        //},
        //vLineWidth: function(i, node) {
        //  return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        //},
        hLineColor: function(i, node) {
          return (i === 0 || i === node.table.body.length) ? 'red' : 'blue';
        },
        vLineColor: function(i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'red' : 'blue';
        },
        paddingLeft: function(i, node) { return 10; },
        paddingRight: function(i, node) { return 5; },
        paddingTop: function(i, node) { return 7; },
        paddingBottom: function(i, node) { return 7; }
      }
    },
  ];

};

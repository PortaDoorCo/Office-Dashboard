import { flatten } from 'lodash';


export default (data, breakdowns) => {

  console.log({data});

  console.log({dataaaaa: flatten(data.part_list)});

  const dim = data.part_list.map(i => {
    return i.dimensions;
  });


  const flatten_d = flatten(dim);

  const arr = [];
  const a = flatten(flatten_d.map(i => {
    return [
      {
        stack: [
          {text: `${data.job_info && data.job_info.customer && data.job_info.customer.Company}`, alignment: 'center', style: 'fonts'},
          {text: `${data.job_info && data.job_info.poNum}`, alignment: 'center', style: 'fonts'},
          {text: `Order#: ${data.orderNum}`, alignment: 'center', style: 'fonts'},
          {text: `${i.width} x ${i.depth} x ${i.height}`, alignment: 'center', style: 'fonts'},
          {text: `Cab#: ${i.cab_number ? i.cab_number : ''}`, alignment: 'center', style: 'fonts'}
        ],
        margin: [0,5,0,0]
      }

    ];
  }));


  let chunk;

  while (a.length > 0) {
    chunk = a.splice(0,3);
    arr.push(chunk);
  }

  const lastArr = (3 - chunk.length);

  if(lastArr>0){
    arr.splice(-Math.abs(chunk.length));

    let el = [];

    for(let i = 0; i<lastArr; i++){
      el.push({text: '', alignment: 'center', margin: [0,5,0,0]});
    }

    console.log({el});

    const elem = [...chunk, el];

    console.log({aaaaa: flatten(elem)});

    arr.push(flatten(elem));

  }
  

  return [
    {
      margin: [-21,0, -11,8],
      table: {
        alignment: 'center',
        widths: [170, 170, 170],
        heights: [57, 57,57, 57, 57, 57, 57, 57, 57, 57],
        body: arr
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

import { flatten } from 'lodash';
import moment from 'moment';

export default (data, breakdowns) => {
  const dim = data.part_list.map((i) => {
    return i.dimensions;
  });

  const flatten_d = flatten(dim);

  const amount = flatten_d.map((n) => parseInt(n.qty));
  const total = amount.reduce((acc, item) => acc + item, 0);

  const arr = [];
  const a = flatten(
    flatten_d.map((i) => {
      let obj = [];

      for (let p = 0; p < parseInt(i.qty); p++) {
        obj.push([
          {
            stack: [
              {
                text: `${
                  data.job_info &&
                  data.job_info.customer &&
                  data.job_info.customer.Company
                }`,
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: `Our Order#: ${data.orderNum}`,
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: `P.O. # ${data.job_info && data.job_info.poNum}`,
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: '# of PCS This Bundle',
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: '_______________',
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: 'Order Due Date',
                alignment: 'center',
                style: 'woodtype',
              },
              {
                text: `${moment(data.dueDate).format('M/D/YYYY')}`,
                alignment: 'center',
                style: 'woodtype',
              },
            ],
            // margin: 5
            margin: [0, 50, 0, 0]
          },
        ]);
      }

      return obj;
    })
  );

  let chunk;

  while (a.length > 0) {
    chunk = a.splice(0, 2);
    arr.push(chunk);
  }

  const lastArr = 2 - chunk.length;

  if (lastArr > 0) {
    arr.splice(-Math.abs(chunk.length));

    let el = [];

    for (let i = 0; i < lastArr; i++) {
      el.push({ 
        text: '', alignment: 'center', 
        // margin: 5 
      });
    }

    const elem = [...chunk, el];

    arr.push(flatten(elem));
  }

  return [
    {
      margin: [-25, -7, -5, 0],
      table: {
        alignment: 'center',
        widths: [275, 275],
        dontBreakRows: true,
        // heights: [260, 260, 240],
        // heights: arr.map((i, index) => {
        //   // if(index % 2 === 0){
        //   //   return 100;
        //   // }else {
        //   //   return 270;
        //   // }
        //   return 100;
        // }),

        heights: function (row) {
          console.log({row});

          // if((row !== 0) && (row % 3 === 0)){
          //   return 100;
          // } else {
          //   return 260;
          // }

          return 240;

        },

        body: arr,
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0;
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
        // paddingLeft: function (i) {
        //   return i === 0 ? 0 : 5;
        // },
        // paddingRight: function (i, node) {
        //   return i === node.table.widths.length - 1 ? 0 : 5;
        // },
        // paddingLeft: function(i, node) { return 10; },
        // paddingRight: function(i, node) { return 5; },
        // paddingTop: function(i, node) { 

        //   console.log({i});
        //   console.log({node});

        //   return 7; 
        // },
        // paddingBottom: function(i, node) { return -0.5; }
      },
    },
  ];
};

import { flatten } from 'lodash';

export default (data, breakdowns) => {
  const dim = data.part_list.map((i) => {
    return i.dimensions;
  });

  const flatten_d = flatten(dim);

  const amount = flatten_d.map((n) => parseInt(n.qty));
  const total = amount.reduce((acc, item) => acc + item, 0);

  const arr = [];
  const a = flatten(
    flatten_d
      .map((i) => {
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
                  style: 'fonts',
                },
                {
                  text: `${data.job_info && data.job_info.poNum}`,
                  alignment: 'center',
                  style: 'fonts',
                },
                {
                  text: `Order#: ${data.id + 100}`,
                  alignment: 'center',
                  style: 'fonts',
                },
                {
                  text: `${i.width} x ${i.depth} x ${i.height}`,
                  alignment: 'center',
                  style: 'fonts',
                },
                {
                  text: `Cab#: ${i.cab_number ? i.cab_number : ''}`,
                  alignment: 'center',
                  style: 'fonts',
                },
              ],
              margin: [0, 0, 0, 0],
            },
          ]);
        }

        return obj;
      })
      .filter((n) => n)
  );

  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }

  let newChunk = splitArrayIntoChunksOfLen(a, 3);

  const lastArr = newChunk[newChunk.length - 1].length;

  if (lastArr !== 3) {
    for (let i = 0; i < 3 - lastArr; i++) {
      newChunk[newChunk.length - 1].push({
        text: '',
        alignment: 'center',
        margin: [0, 0, 0, 0],
      });
    }
  }

  return [
    {
      margin: [0, 0, 0, 0],
      table: {
        alignment: 'center',
        widths: [170, 170, 170], // Adjust to fit the width of each label
        heights: Array(newChunk.length).fill(72), // Fixed height for Avery 5160 labels
        body: newChunk,
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        paddingLeft: function (i) {
          return 12; // Adjust padding as needed
        },
        paddingRight: function (i) {
          return 12; // Adjust padding as needed
        },
        paddingTop: function () {
          return 1; // Adjusted to move content up
        },
        paddingBottom: function () {
          return 1; // Adjust to center vertically
        },
      },
    },
  ];
};

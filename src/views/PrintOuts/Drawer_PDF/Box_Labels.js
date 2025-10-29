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
                  text: `Cab#: ${
                    i.cab_number ? i.cab_number.replace(/\n/g, ' ') : ' '
                  }`,
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
    const chunks = [];
    let i = 0;
    const n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i + len));
      i += len;
    }
    return chunks;
  }

  let newChunk = splitArrayIntoChunksOfLen(a, 3);

  const lastArr = newChunk[newChunk.length - 1].length;

  if (lastArr !== 3) {
    for (let i = 0; i < 3 - lastArr; i++) {
      newChunk[newChunk.length - 1].push({
        text: ' ',
        alignment: 'center',
        margin: [0, 0, 0, 0],
      });
    }
  }

  // Assign IDs to each row in newChunk
  let newNewChunk = newChunk.map((row, rowIndex) => {
    return row.map((cell) => {
      // Assign a unique ID to each cell
      if (cell.stack) {
        cell.id = `row-${rowIndex}`;
      }
      return cell;
    });
  });

  return [
    {
      margin: [0, 0, 0, 0],
      table: {
        alignment: 'center',
        widths: [170, 170, 170], // Adjust to fit the width of each label
        heights: function (rowIndex) {
          return 72; // Adjusted height for each label row
        },
        body: newNewChunk,
        dontBreakRows: true,
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

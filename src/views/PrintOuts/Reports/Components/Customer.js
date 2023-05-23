import moment from 'moment';

export default (data, startDate, endDate, status, company) => {
  let tableBody = [
    [
      { text: 'Date Created' },
      // { text: 'Date Ordered' },

      { text: 'Job ID' },

      { text: 'Description' },
      { text: 'Doors' },
      { text: 'DFs' },
      { text: 'Boxes' },
      { text: 'Face Frames' },
      { text: 'Total' },
      { text: 'Net Total' },
      { text: 'Tax' },
      { text: 'Status' },
      { text: 'Due Date' },
      { text: 'Date Invoiced' },
      { text: 'Date Shipped' },
    ],
  ];

  if (status === 'Quote') {
    tableBody = [
      [
        { text: 'Date Created' },
        // { text: 'Date Ordered' },

        { text: 'Job ID' },

        { text: 'Description' },
        { text: 'Doors' },
        { text: 'DFs' },
        { text: 'Boxes' },
        { text: 'Face Frames' },
        { text: 'Total' },
        { text: 'Net Total' },
        { text: 'Tax' },
        { text: 'Status' },
        { text: 'Due Date' },
        { text: 'Date Invoiced' },
        { text: 'Date Shipped' },
      ],
    ];
  } else {
    tableBody = [
      [
        // { text: 'Date Created' },
        { text: 'Date Ordered' },

        { text: 'Job ID' },

        { text: 'Description' },
        { text: 'Doors' },
        { text: 'DFs' },
        { text: 'Boxes' },
        { text: 'Face Frames' },
        { text: 'Total' },
        { text: 'Net Total' },
        { text: 'Tax' },
        { text: 'Status' },
        { text: 'Due Date' },
        { text: 'Date Invoiced' },
        { text: 'Date Shipped' },
      ],
    ];
  }

  let total = 0;
  let netTotal = 0;
  let taxTotal = 0;
  let doorTotal = 0;
  let dfTotal = 0;
  let boxTotal = 0;
  let faceFrameTotal = 0;

  data.forEach((i, index) => {
    total = Math.round(100 * (total += i.total)) / 100;
    netTotal = Math.round(100 * (netTotal += i.total - i.tax)) / 100;
    taxTotal = Math.round(100 * (taxTotal += i.tax)) / 100;
    let doors = 0;
    let dfs = 0;
    let boxes = 0;
    let face_frames = 0;

    let name = i.job_info?.poNum?.length > 0 ? i.job_info?.poNum : 'None';
    if (i.orderType === 'Door Order') {
      i.part_list.map((part) => {
        if (part.orderType?.value === 'Door') {
          return part.dimensions?.map((j) => {
            return (
              (doors = doors += parseInt(j.qty)),
              (doorTotal = doorTotal += parseInt(j.qty))
            );
          });
        } else {
          return part.dimensions?.map((j) => {
            return (
              (dfs = dfs += parseInt(j.qty)),
              (dfTotal = dfTotal += parseInt(j.qty))
            );
          });
        }
      });
    } else if (i.orderType === 'Face Frame') {
      i.part_list.map((part) => {
        return part.dimensions?.map((j) => {
          return (
            (face_frames = face_frames += parseInt(j.qty)),
            (faceFrameTotal = faceFrameTotal += parseInt(j.qty))
          );
        });
      });
    } else {
      i.part_list.map((part) => {
        return part.dimensions?.map((j) => {
          return (
            (boxes = boxes += parseInt(j.qty)),
            (boxTotal = boxTotal += parseInt(j.qty))
          );
        });
      });
    }

    if (status === 'Quote') {
      return tableBody.push([
        moment(i.created_at).format('MM/DD/YYYY'),

        i.id + 100,

        name,
        doors,
        dfs,
        boxes,
        face_frames,
        `$${i.total?.toFixed(2)}`,
        `$${(i.total - i.tax)?.toFixed(2)}`,
        `$${i.tax?.toFixed(2)}`,
        i.status,
        i.Shipping_Scheduled ? moment(i.dueDate).format('MM/DD/YYYY') : 'TBD',
        i.DateInvoiced ? moment(i.DateInvoiced).format('MM/DD/YYYY') : 'TBD',
        i.DateShipped ? moment(i.DateShipped).format('MM/DD/YYYY') : 'TBD',
      ]);
    } else {
      return tableBody.push([
        i.DateOrdered ? moment(i.DateOrdered).format('MM/DD/YYYY') : 'TBD',

        i.id + 100,

        name,
        doors,
        dfs,
        boxes,
        face_frames,
        `$${i.total?.toFixed(2)}`,
        `$${(i.total - i.tax)?.toFixed(2)}`,
        `$${i.tax?.toFixed(2)}`,
        i.status,
        i.Shipping_Scheduled ? moment(i.dueDate).format('MM/DD/YYYY') : 'TBD',
        i.DateInvoiced ? moment(i.DateInvoiced).format('MM/DD/YYYY') : 'TBD',
        i.DateShipped ? moment(i.DateShipped).format('MM/DD/YYYY') : 'TBD',
      ]);
    }
  });

  let totalBody = [
    [
      '',
      'Doors',
      'DFs',
      'Boxes',
      'Face Frames',
      'Total',
      'Net Total',
      'Tax Total',
      '',
    ],
    [
      '',
      doorTotal,
      dfTotal,
      boxTotal,
      faceFrameTotal,
      `$${total.toFixed(2)}`,
      `$${netTotal.toFixed(2)}`,
      `$${taxTotal.toFixed(2)}`,
      '',
    ],
  ];

  return [
    {
      columns: [
        {
          stack: [
            `${company} - REPORT - ${moment(startDate).format(
              'MM/DD/YYYY'
            )} thru ${moment(endDate).format('MM/DD/YYYY')}`,
          ],
        },
        {
          stack: [{ text: `Status: ${status}`, alignment: 'right' }],
        },
      ],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: tableBody,
        widths: [45, 30, 90, 23, 18, 23, 27, 40, 40, 35, 50, 45, 45, 45],
      },
      layout: 'lightHorizontalLines',
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: [195, 23, 18, 23, 27, 45, 45, 35, 230],
      },
      layout: 'headerLineOnly',
    },
  ];
};

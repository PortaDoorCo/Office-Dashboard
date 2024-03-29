import moment from 'moment';

export default (data, startDate, endDate, status) => {
  const tableBody = [
    [
      { text: 'Due Date' },
      { text: 'Customer' },
      { text: 'Job ID' },
      { text: 'Status' },
      { text: 'Description' },
      { text: 'Doors' },
      { text: 'DFs' },
      { text: 'Boxes' },
      { text: 'Face Frames' },
      { text: 'Total' },
      { text: 'Notes' },
    ],
  ];
  let total = 0;
  let doorTotal = 0;
  let dfTotal = 0;
  let boxTotal = 0;
  let faceFrameTotal = 0;

  data.forEach((i, index) => {
    total = Math.round(100 * (total += i.total)) / 100;
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

    return tableBody.push([
      i.Shipping_Scheduled ? moment(i.dueDate).format('MM/DD/YYYY') : 'TBD',
      i.job_info.customer.Company,
      i.id + 100,
      i.status,
      name,
      doors,
      dfs,
      boxes,
      face_frames,
      `$${i.total.toFixed(2)}`,
      '',
    ]);
  });

  let totalBody = [
    ['', 'Doors', 'DFs', 'Boxes', 'Face Frames', 'Total', ''],
    [
      '',
      doorTotal,
      dfTotal,
      boxTotal,
      faceFrameTotal,
      `$${total.toFixed(2)}`,
      '',
    ],
  ];

  return [
    {
      columns: [
        {
          stack: [`${status} - ${moment().format('MM/DD/YYYY')}`],
        },
        {
          stack: [{ text: '', alignment: 'right' }],
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
        widths: [60, 120, 40, 50, 60, 30, 30, 30, 45, 50, 70],
      },
      layout: 'lightHorizontalLines',
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: [383, 40, 35, 35, 42, '*', '*'],
      },
      layout: 'headerLineOnly',
    },
  ];
};

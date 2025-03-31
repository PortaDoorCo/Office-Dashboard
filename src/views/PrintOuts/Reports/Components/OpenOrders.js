import moment from 'moment';

export default (data, startDate, endDate, status, showPrice = false) => {
  // Ensure showPrice is a boolean
  const shouldShowPrice = Boolean(showPrice);

  const baseColumns = [
    { text: 'Due Date' },
    { text: 'Customer' },
    { text: 'Job ID' },
    { text: 'Status' },
    { text: 'Description' },
    { text: 'Doors' },
    { text: 'DFs' },
    { text: 'Boxes' },
    { text: 'Face Frames' },
  ];

  if (shouldShowPrice) {
    baseColumns.push({ text: 'Total' });
  }

  baseColumns.push({ text: 'Notes' });

  const tableBody = [baseColumns];
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

    const rowData = [
      moment(i.dueDate).format('MM/DD/YYYY'),
      i.job_info.customer.Company,
      i.id + 100,
      i.status,
      name,
      doors,
      dfs,
      boxes,
      face_frames,
    ];

    if (shouldShowPrice) {
      rowData.push(`$${i.total.toFixed(2)}`);
    }

    rowData.push('');

    return tableBody.push(rowData);
  });

  const totalColumns = ['', 'Doors', 'DFs', 'Boxes', 'Face Frames'];
  if (shouldShowPrice) {
    totalColumns.push('Total');
  }
  totalColumns.push('');

  const totalValues = ['', doorTotal, dfTotal, boxTotal, faceFrameTotal];
  if (shouldShowPrice) {
    totalValues.push(`$${total.toFixed(2)}`);
  }
  totalValues.push('');

  let totalBody = [totalColumns, totalValues];

  const columnWidths = [55, '*', 40, '*', '*', 30, 30, 30, 35];
  if (shouldShowPrice) {
    columnWidths.push(60);
  }
  columnWidths.push('*');

  return [
    {
      columns: [
        {
          stack: [
            `${status} - ${moment(startDate).format(
              'MM/DD/YYYY'
            )} thru ${moment(endDate).format('MM/DD/YYYY')}`,
          ],
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
        widths: columnWidths,
      },
      layout: 'lightHorizontalLines',
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: shouldShowPrice
          ? [383, 30, 30, 30, 36, '*', '*']
          : [323, 30, 30, 30, 36, '*'],
      },
      layout: 'headerLineOnly',
    },
  ];
};

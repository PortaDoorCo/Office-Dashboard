import moment from 'moment';

export default (data, startDate, endDate, status) => {


  const tableBody = [
    [
      { text: 'Date Created' },
      { text: 'Date' },
      { text: 'Customer' },
      { text: 'Job ID' },
      { text: 'Status' },
      { text: 'Description' },
      { text: 'Doors' },
      { text: 'DFs' },
      { text: 'Boxes' },
      { text: 'Total' },
      { text: 'Due On' }
    ]
  ];
  let total = 0;
  let doorTotal = 0;
  let dfTotal = 0;
  let boxTotal = 0;
  data.forEach((i, index) => {
    total = total += i.total;
    let doors = 0;
    let dfs = 0;
    let boxes = 0;
    let name = i.job_info?.poNum ? i.job_info?.poNum : 'None';
    if (i.orderType === 'Door Order') {
      i.part_list.map(part => {
        if (part.orderType.value === 'Door') {
          return (doors++,
          doorTotal++);
        } else {
          return(dfs++,
          dfTotal++);
        }
      });
    } else {
      boxes++;
      boxTotal++;
    }

    const dateOrdered = i?.tracking?.filter((x) => {
      return x.status === 'Ordered';
    });

    return tableBody.push(
      [moment(i.created_at).format('MM/DD/YYYY'),
        i.DateOrdered || dateOrdered.length > 0
          ? moment(i.DateOrdered || dateOrdered[0].date).format('MM/DD/YYYY')
          : 'TBD',
        i.job_info?.customer?.Company,
        i.orderNum,
        i.status,
        name,
        doors,
        dfs,
        boxes,
        i.total?.toFixed(2),
        moment(i.DueDate).format('MM/DD/YYYY')
      ]
    );
  });
  let totalBody = [
    ['', 'Doors', 'DFs', 'Boxes', 'Total', ''],
    ['', doorTotal, dfTotal, boxTotal, `$${total.toFixed(2)}`, '']
  ];

  return [
    {
      columns: [
        {
          stack: [
            'SALESMEN REPORT',

          ]
        }, {
          stack: [
            `${moment(startDate).format('MM/DD/YYYY')} thru ${moment(endDate).format('MM/DD/YYYY')}`
          ]
        },
        {
          stack: [
            { text: `${status}`, alignment: 'right' }
          ]
        },
      ]
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: tableBody,
      },
      layout: 'headerLineOnly'
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: totalBody,
        widths: [283, '*', '*', '*', '*', '*']
      },
      layout: 'headerLineOnly'
    },
  ];
};

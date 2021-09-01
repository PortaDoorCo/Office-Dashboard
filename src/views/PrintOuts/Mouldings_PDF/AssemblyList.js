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
      { text: 'Linear Ft', style: 'fonts' },
      { text: 'Style', style: 'fonts' },
      { text: 'Grade', style: 'fonts' },
      { text: 'Woodtype', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
    ],
  ];

  const t = data.mouldings?.forEach(i => {
    tableBody.push([
      { text: i.linearFT, style: 'fonts' },
      { text: i.style.name, style: 'fonts' },
      { text: i.grade.name, style: 'fonts' },
      { text: i.woodtype.NAME, style: 'fonts' },
      { text: i.item.NAME, style: 'fonts' },
    ]);
  });



  return [
    {
      columns: [
        {
          stack: [
            { text: 'Assembly List', bold: true },
            `Shipping Date: ${moment(data.job_info.DueDate).format(
              'MM/DD/YYYY'
            )}`,
            { qr: `${data.id}`, fit: '75', margin: [0, 5, 0, 0] },
          ],
        },
        {
          stack: [
            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            { text: '203-888-6191', alignment: 'center' },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
          ],
        },
        {
          stack: [
            {
              text:
                data.job_info.Rush && data.job_info.Sample
                  ? 'Sample / Rush'
                  : data.job_info.Rush
                    ? 'Rush'
                    : data.job_info.Sample
                      ? 'Sample'
                      : '',
              alignment: 'right',
              bold: true,
            },
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
            {
              text: `Est. Completion: ${moment(data.job_info.DueDate).format(
                'MM/DD/YYYY'
              )}`,
              alignment: 'right',
            },
            {
              text: `Ship Via: ${
                data.job_info.shipping_method
                  ? data.job_info.shipping_method.NAME
                  : ''
              }`,
              alignment: 'right',
            },
          ],
        },
      ],
    },
    {
      stack: [
        {
          text: `${data.orderNum}`,
          style: 'orderNum',
        },
        {
          columns: [
            {
              text: `${data.job_info.customer.Company}`,
            },
            {
              text: `${data.job_info?.Shop_Notes ? data.job_info?.Shop_Notes?.toUpperCase() : ''}`,
              alignment: 'center'
            },
            {
              text: `PO: ${data.job_info.poNum.toUpperCase()}`,
              alignment: 'right',
            },
          ],
        },
      ],
      margin: [0, 10],
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
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

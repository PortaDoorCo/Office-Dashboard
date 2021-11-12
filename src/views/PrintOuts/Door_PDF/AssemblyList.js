import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import Size from '../Breakdowns/Doors/Size';
import SlabSize from '../Breakdowns/Doors/SlabSize';
import GlassSort from '../Sorting/GlassSort';

export default (data, breakdowns) => {


  let itemNum = 0;


  const table_content = data.part_list.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'WxH', style: 'fonts' },
        { text: 'Stile', style: 'fonts' },
        { text: 'Rails', style: 'fonts' },
        { text: 'Panels WxH', style: 'fonts' },
      ],
    ];

    GlassSort(i).forEach((item, ind) => {

      itemNum += 1;
      
      console.log({item});

      tableBody.push([
        { text: itemNum, style: 'fonts' },
        { text: item.qty, style: 'fonts' },
        {
          stack: [
            { text: `${Size(item)}`, style: 'fonts' },
            item.notes || item.full_frame || item.lite
              ? {
                text: `${item.notes ? item.notes.toUpperCase() : ''} ${item.lite ? item.lite.NAME : ''}`,
                style: 'tableBold',
                alignment: 'left',
              }
              : null,
          ],
        },
        {
          text: (Stiles(item, i, breakdowns) || []).map((stile) => {
            return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
          }),
          style: 'fonts',
        },
        {
          text: (Rails(item, i, breakdowns) || []).map((rail) => {
            return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
              item.full_frame ? '** Full Frame DF **' : ''
            }`;
          }),
          style: 'fonts',
        },
        {
          stack: [
            {
              text: (Panels(item, i, breakdowns) || []).map((panel) => {

                console.log({qty: panel.qty});
                console.log({measurement: panel.measurement});
                console.log({pattern: panel.pattern});

                return `${panel.qty} ${panel.measurement} ${
                  '- ' + panel.pattern
                } \n`;
              }),
              style: 'fonts',
            },
            item.cab_number
              ? {
                text: `Cab#: ${item.cab_number ? item.cab_number : ''}`,
                style: 'tableBold',
                alignment: 'left',
              }
              : null,
          ],
        },
      ]);
    });
    

    return [
      {
        margin: [0, 0, 0, 0],
        columns: [
          {
            stack: [
              {
                text: `${i.orderType ? i.orderType.name : ''}`,
                style: 'fonts',
              },
              {
                text: `${
                  i.design
                    ? i.design.NAME
                    : i.face_frame_design
                      ? i.face_frame_design.NAME
                      : i.construction.value === 'Slab'
                        ? 'Slab'
                        : ''
                } ${(i.construction.value === 'MT') || (i.construction.value === 'Miter') ? i.construction.value : ''} ${i.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''} - ${
                  i.panel
                    ? i.panel.NAME
                    : i.construction.value === 'Slab'
                      ? ''
                      : 'Glass'
                }`,
                style: 'fonts',
              },
              {
                text: `${i.thickness?.grade_name ? i.thickness?.grade_name : ''}${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${i.thickness.thickness_2}"`,
                style: 'woodtype',
              },
            ],
          },
          {
            stack: [
              {
                text: `${i.notes ? i.notes.toUpperCase() : ''}`,
                style: 'fontsBold',
                alignment: 'center',
              },
              {
                text: `${i.applied_profile ? i.applied_profile.NAME.toUpperCase() : ''}`,
                style: 'fontsBold',
                alignment: 'center',
              },
            ],
          },
          {
            stack: [
              {
                text: `Thickness:  ${
                  i.thickness ? i.thickness.thickness_2 : ''
                }"`,
                style: 'fonts',
              },
              {
                text: `IP:  ${i.profile ? i.profile.NAME : i.design ? i.design.NAME : 'None'}   Edge:  ${
                  i.edge ? i.edge.NAME : 'None'
                }`,
                style: 'fonts',
              },
              // { text: `Applied Profile: ${i.applied_profile ? i.applied_profile.NAME : 'None'}`, style: 'fonts' },
            ],
            alignment: 'right',
          },
        ],
      },
      {
        text: '==============================================================================',
        alignment: 'center',
        margin: [0, 0, 0, 0],
      },
      {
        table: {
          headerRows: 1,
          widths: [21, 20, 94, 105, 105, 110],
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
    ];
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
              text: `${
                data.job_info?.Shop_Notes
                  ? data.job_info?.Shop_Notes?.toUpperCase()
                  : ''
              }`,
              alignment: 'center',
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
      margin: [0, 10, 0, 0],
    },
    table_content,
    // { text: '', pageBreak: 'before' }
  ];
};

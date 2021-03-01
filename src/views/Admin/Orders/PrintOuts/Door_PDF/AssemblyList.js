import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import Size from '../Breakdowns/Doors/Size';
import SlabSize from '../Breakdowns/Doors/SlabSize';

export default (data, breakdowns) => {
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
                data.job_info.ShippingMethod
                  ? data.job_info.ShippingMethod.NAME
                  : ''
              }`,
              alignment: 'right',
            },
          ],
        },
      ],
    },
    {
      columns: [
        {
          text: `${data.job_info.customer.Company}`,
        },
        {
          stack: [{ text: `PO: ${data.job_info.poNum}`, alignment: 'right' }],
        },
      ],
      margin: [0, 10],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    },
    data.part_list.map((i, index) => {
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

      if (i.orderType.value === 'Slab_Door') {
        i.dimensions.forEach((item, index) => {
          tableBody.push([
            { text: index + 1, style: 'fonts' },
            { text: item.qty, style: 'fonts' },
            {
              text: `${SlabSize(item, i.edge.LIP_FACTOR)} ${
                item.notes ? item.notes : ''
              }`,
              style: 'fonts',
            },
            {
              text: Stiles(item, i, breakdowns).map((stile) => {
                return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
              }),
              style: 'fonts',
            },
            {
              text: Rails(item, i, breakdowns).map((rail) => {
                return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
                  item.full_frame ? '** Full Frame DF **' : ''
                }`;
              }),
              style: 'fonts',
            },
            { text: SlabSize(item, i.edge.LIP_FACTOR), style: 'fonts' },
          ]);
        });
      } else {
        i.dimensions.forEach((item, index) => {
          tableBody.push([
            { text: index + 1, style: 'fonts' },
            { text: item.qty, style: 'fonts' },
            {
              stack: [
                { text: `${Size(item)} \n `, style: 'fonts' },
                {
                  text: `${item.notes ? item.notes : ''} ${
                    item.full_frame ? 'Full Frame DF' : ''
                  } ${item.lite ? item.lite.NAME : ''}`,
                  style: 'tableBold',
                  margin: [0, 4, 0, 0],
                },
              ],
            },
            {
              text: `${Stiles(item, i, breakdowns).map((stile) => {
                return `${stile.qty} ${stile.measurement} - ${stile.pattern} \n`;
              })}`,
              style: 'fonts',
            },
            {
              text: Rails(item, i, breakdowns).map((rail) => {
                return `${rail.qty} ${rail.measurement} - ${rail.pattern} \n ${
                  item.full_frame ? '** Full Frame DF **' : ''
                }`;
              }),
              style: 'fonts',
            },
            {
              text: Panels(item, i, breakdowns).map((panel) => {
                return `${panel.qty} ${panel.measurement} - ${panel.pattern} \n`;
              }),
              style: 'fonts',
            },
          ]);
        });
      }

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `${i.orderType.name}`,
                  style: 'fonts',
                },
                {
                  text: `${
                    i.cope_design
                      ? i.cope_design.NAME
                      : i.mt_design
                        ? i.mt_design.NAME + ' ' + i.construction.value
                        : i.miter_design
                          ? i.miter_design.NAME + ' ' + i.construction.value
                          : i.miter_df_design
                            ? i.miter_df_design.NAME + ' ' + i.construction.value
                            : i.mt_df_design
                              ? i.mt_df_design.NAME + ' ' + i.construction.value
                              : (i.orderType.value === 'Slab_Door' || i.orderType.value === 'Slab_DF') ? '' :
                                i.construction.name
                  } - ${i.panel ? i.panel.NAME : ''} ${
                    i.lite ? '- ' + i.lite.NAME : ''
                  }`,
                  style: 'fonts',
                },
                { text: `${i.woodtype.NAME}`, style: 'woodtype' },
              ],
            },
            { text: `${i.notes ? i.notes : ''}`, style: 'fontsBold' },
            {
              stack: [
                {
                  text: `Thickness: ${i.thickness ? i.thickness.name : ''}"`,
                  style: 'fonts',
                },
                {
                  text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
                  style: 'fonts',
                },
                {
                  text: `Edge: ${i.edge ? i.edge.NAME : 'None'}`,
                  style: 'fonts',
                },
                // { text: `Applied Profile: ${i.applied_profile ? i.applied_profile.NAME : 'None'}`, style: 'fonts' },
              ],
              alignment: 'right',
            },
          ],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 0],
        },
        {
          table: {
            headerRows: 1,
            widths: [22, 15, 100, 110, 110, 110],
            body: tableBody,
          },
          layout: 'lightHorizontalLines',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 },
          ],
        },
      ];
    }),
    { text: '', pageBreak: 'before' }
  ];
};

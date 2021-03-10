import moment from 'moment';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import { flattenDeep, uniq, flatten, groupBy } from 'lodash';

export default (data, breakdowns) => {
  const getName = i => {
    return `${
      i.cope_design
        ? i.cope_design.NAME
        : i.cope_df_design
          ? i.cope_df_design.NAME + ' DF'
          : i.mt_design
            ? i.mt_design.NAME + ' ' + i.construction.value
            : i.miter_design
              ? i.miter_design.NAME + ' ' + i.construction.value
              : i.miter_df_design
                ? i.miter_df_design.NAME + ' ' + i.construction.value
                : i.mt_df_design
                  ? i.mt_df_design.NAME + ' ' + i.construction.value
                  : i.face_frame_design
                    ? i.face_frame_design.NAME
                    : i.orderType.value === 'Slab_Door' ||
        i.orderType.value === 'Slab_DF'
                      ? ''
                      : ''
    }`;
  };
  const a = Object.values(groupBy(data.part_list, (x) => x?.woodtype?.NAME));
  const c = a.map(woodtype => woodtype.map((v, i) => ({...v, dimensions: flattenDeep( v.dimensions.map(d => ({...d, name: getName(v)}))  ) })));
  const b = c.map((t, x) => {
    console.log({xxxxxxxxxx:x, ttttttttt: t, txxxxxxxxxxxx:t[x]});
    return ({...t[0], dimensions: flattenDeep(t.map(c => c.dimensions))});
  });


  console.log({b});
  

  //console.log({ partttt: b, adtttt: data.part_list, aaaaaaaa: a, cccccc: c });

  const table_body = b.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Length', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Arch', style: 'fonts' },
        { text: '' },
      ],
    ];
    i.dimensions.forEach((item, index) => {
      if (
        (item.panelsH && item.panelsW > 1) ||
        (item.panelsH > 1 && item.panelsW)
      ) {
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          {
            text: item.name,
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.qty} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.measurement} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text:
              i.cope_design && i.cope_design.TOP_RAIL_ADD > 0
                ? i.cope_design.NAME
                : '',
            style: 'fonts',
          },
          { text: '' },
        ]);
      } else {
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          {
            text: item.name,
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.qty} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.measurement} \n`;
            }),
            style: 'fonts',
          },
          {
            text: Rails(item, i, breakdowns).map((rail) => {
              return `${rail.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text:
              i.cope_design && i.cope_design.TOP_RAIL_ADD > 0
                ? i.cope_design.NAME
                : '',
            style: 'fonts',
          },
          { text: '' },
        ]);
      }
    });

    if (
      i.orderType.value === 'One_Piece' ||
      i.orderType.value === 'One_Piece_DF' ||
      i.orderType.value === 'Two_Piece' ||
      i.orderType.value === 'Two_Piece_DF' ||
      i.orderType.value === 'Slab_Door' ||
      i.orderType.value === 'Slab_DF'
    ) {
      return null;
    } else {
      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `${i.woodtype.NAME} - ${
                i.thickness.value === 0.75
                  ? '4/4 - 3/4"'
                  : i.thickness.value === 1
                    ? '5/4 - 1"'
                    : ''
              }`,
              style: 'woodtype',
            },
            {
              text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
              style: 'woodtype',
              alignment: 'left',
            },
            {
              text: 'STILES',
              alignment: 'right',
              style: 'woodtype',
            },
          ],
        },
        {
          text:
            '==============================================================================',
          alignment: 'center',
        },
        {
          table: {
            headerRows: 1,
            widths: [22, 95, 30, '*', 200],
            body: tableBody,
          },
          layout: {
            hLineWidth: function (i, node) {
              console.log(i, node);
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
          text:
            '==============================================================================',
          alignment: 'center',
        },

        // { text: '', pageBreak: 'before' }
      ];
    }
  });

  // const table_body = [];

  return [
    {
      columns: [
        {
          stack: [
            'Individual - STILES List',
            `Shipping Date: ${moment(data.job_info.DueDate).format(
              'MM/DD/YYYY'
            )}`,
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
    table_body,
  ];
};

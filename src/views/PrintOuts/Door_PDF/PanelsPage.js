import moment from 'moment';
import Panels from '../Breakdowns/Doors/Panels/Panels';
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
  const b = a.map(woodtype => woodtype.map((v, i) => ({...v, dimensions: flattenDeep( v.dimensions.map(d => ({...d, name: getName(v)}))  ) }))).map((t, x) => ({...t[0], dimensions: flattenDeep(t.map(c => c.dimensions))}));
  

  console.log({ partttt: b, adtttt: data.part_list, aaaaaaaa: a });

  const table_body = b.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Height', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Arch', style: 'fonts' },
        { text: 'Panel' },
        { text: 'Note', style: 'fonts' }
      ]
    ];

    if (
      i.construction.value === 'Slab' ||
      i.orderType.value === 'One_Piece' ||
      i.orderType.value === 'One_Piece_DF' ||
      i.orderType.value === 'Two_Piece' ||
      i.orderType.value === 'Two_Piece_DF' ||
      i.orderType.value === 'Slab_Door' ||
      i.orderType.value === 'Slab_DF'
    ) {
      return null;
    } else {
      i.dimensions.forEach((item, index) => {
        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          { text: item.name, style: 'fonts' },
          { text: Panels(item, i, breakdowns).map(panel => { return `${panel.qty} \n`; }), style: 'fonts' },
          { text: Panels(item, i, breakdowns).map(panel => { return `${panel.measurement} \n`; }), style: 'fonts' },
          { text: Panels(item, i, breakdowns).map(panel => { return `${panel.pattern} \n`; }), style: 'fonts' },
          { text: i.cope_design && i.cope_design.TOP_RAIL_ADD > 0 ? i.cope_design.NAME : '', style: 'fonts' },
          { text: `${i.panel ? i.panel.NAME : 'Glass'}`, style: 'fonts' },
          item.notes || item.full_frame || item.lite ? 
            {
              text: `${item.notes ? item.notes : ''} ${
                item.full_frame ? 'Full Frame DF' : ''
              } ${item.lite ? item.lite.NAME : ''}`,
              style: 'tableBold', alignment: 'left'
            } : null,
        ]);
      });
    }



    if (
      i.construction.value === 'Slab' ||
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
              width: 200
            },
            {
              text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
              style: 'woodtype',
              alignment: 'left',
            },
            {
              text: 'PANELS',
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
            // widths: [22, 95, 30, '*', 200],
            widths: [22, 50, 30, 100, 25, 40, 40, 120],
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
            'Individual - PANELS List',
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
              text: `Estimated Ship: ${moment(data.job_info.DueDate).format(
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
          style: 'fonts'
        },
        {
          stack: [{ text: `PO: ${data.job_info.poNum}`, alignment: 'right', style: 'fonts' }],
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

import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import { flattenDeep, uniq, flatten, groupBy } from 'lodash';

export default (data, breakdowns) => {
  const getName = (i) => {
    return `${
      i.design
        ? i.design.NAME
        : i.face_frame_design
          ? i.face_frame_design.NAME
          : i.construction.value === 'Slab'
            ? 'Slab'
            : ''
    }`;
  };
  const a = Object.values(groupBy(data.part_list, (x) => x?.woodtype?.NAME));
  const b = a
    .map((woodtype) =>
      woodtype.map((v, i) => ({
        ...v,
        dimensions: flatten(
          v.dimensions.map((d, k ) => ({ ...d, name: getName(v), item: k + 1 }))
        ),
      }))
    )
    .map((t, x) => ({
      ...t[0],
      dimensions: flatten(t.map((c) => c.dimensions)),
    }));


  const table_body = b.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Length', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Note', style: 'fonts' },
      ],
    ];
    i.dimensions.forEach((item, index) => {
      tableBody.push([
        { text: item.item ? item.item : index + 1, style: 'fonts' },
        {
          text: item.name,
          style: 'fonts',
        },
        {
          text: Stiles(item, i, breakdowns).map((stile) => {
            return `${stile.qty} \n`;
          }),
          style: 'fonts',
        },
        {
          text: Stiles(item, i, breakdowns).map((stile) => {
            return `${stile.measurement} \n`;
          }),
          style: 'fonts',
        },
        {
          text: Stiles(item, i, breakdowns).map((stile) => {
            return `${stile.pattern} \n`;
          }),
          style: 'fonts',
        },
        {
          text: item.notes ? item.notes.toUpperCase() : '',
          style: 'fonts',
        },
      ]);
    });

    if (
      i.orderType.value === 'One_Piece' ||
      i.orderType.value === 'One_Piece_DF' ||
      i.orderType.value === 'Two_Piece' ||
      i.orderType.value === 'Two_Piece_DF' ||
      i.orderType.value === 'Slab_Door' ||
      i.orderType.value === 'Slab_DF' ||
      i.construction.value === 'Slab' ||
      i.door_piece_number?.pieces === (1 || 2)
    ) {
      return null;
    } else {
      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${i.thickness.thickness_2}"`,
              style: 'woodtype',
              width: 200,
            },
            {
              text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
              style: 'woodtype',
              alignment: 'center',
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
            widths: [22, 80, 30, 120, 50, '*'],
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
          stack: ['Individual - STILES List'],
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
      stack: [
        {
          text: `${data.orderNum}`, style: 'orderNum' ,
        },
        {
          columns: [
            {
              text: `${data.job_info.customer.Company}`,
            },
            {
              text: `${data.job_info.Shop_Notes?.toUpperCase()}`,
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
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
    },
    table_body,
  ];
};

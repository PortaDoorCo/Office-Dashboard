import moment from 'moment';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import { flattenDeep, uniq, flatten, groupBy } from 'lodash';
import GlassSort from '../Sorting/GlassSort';
import Glass_Selection from '../Sorting/Glass_Selection';

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

      woodtype.map((v, i) => {

        console.log({v});

        return {
          ...v,
          dimensions: flatten(
            v.dimensions.map((d, k) => ({ ...d, name: getName(v), item: k + 1 })))
        };
      })


    )
    .map((t, x) => ({
      ...t[0],
      dimensions: flatten(t.map((c) => c.dimensions)),
    }));

  const table_body = b.map((i, index) => {

    console.log({i});

    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Height', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Arch', style: 'fonts' },
        { text: 'Panel', style: 'fonts' },
        { text: 'Note', style: 'fonts' },
      ],
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
      GlassSort(i).forEach((item, index) => {
        console.log({ item });

        if (item.glass_index === 1) {
          return null;
        } else {
          tableBody.push([
            { text: item.item ? item.item : index + 1, style: 'fonts' },
            { text: item.name, style: 'fonts' },
            {
              text: Panels(item, i, breakdowns).map((panel) => {
                return `${panel.qty} \n`;
              }),
              style: 'fonts',
            },
            {
              text: Panels(item, i, breakdowns).map((panel) => {
                return `${panel.measurement} \n`;
              }),
              style: 'fonts',
            },
            {
              text: Panels(item, i, breakdowns).map((panel) => {
                return `${panel.pattern} \n`;
              }),
              style: 'fonts',
            },
            {
              text: i.design && i.design.TOP_RAIL_ADD > 0 ? i.design.NAME : '',
              style: 'fonts',
            },
            {
              text: Panels(item, i, breakdowns).map((panel) => {
                return `${panel.panel} \n`;
              }),
              style: 'fonts',
            },
            item.notes || item.full_frame || item.lite
              ? {
                text: `${item.notes ? item.notes : ''} ${
                  item.full_frame ? 'Full Frame DF' : ''
                } ${item.lite ? item.lite.NAME : ''}`,
                style: 'tableBold',
                alignment: 'left',
              }
              : null,
          ]);
        }
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
              text: `${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${i.thickness.thickness_2}"`,
              style: 'woodtype',
            },
            {
              text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
              style: 'woodtype',
              alignment: 'center',
            },
            {
              text: 'PANELS',
              alignment: 'right',
              style: 'woodtype',
            },
          ],
        },
        {
          text: '==============================================================================',
          alignment: 'center',
        },
        {
          table: {
            headerRows: 1,
            // widths: [22, 95, 30, '*', 200],
            widths: [22, 50, 20, 80, 25, 30, 70, 120],
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
    }
  });

  // const table_body = [];

  return [
    {
      columns: [
        {
          stack: ['Individual - PANELS List'],
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
          text: `${data.orderNum}`,
          style: 'orderNum',
        },
        {
          columns: [
            {
              text: `${data.job_info.customer.Company}`,
            },
            {
              text: `${data.job_info.Shop_Notes.toUpperCase()}`,
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

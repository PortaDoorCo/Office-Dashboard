import { flatten, groupBy } from 'lodash';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import GlassSort from '../Sorting/GlassSort';
import HeightSort from '../Sorting/HeightSort';

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
    } ${(i.construction.value === 'MT') || (i.construction.value === 'Miter') ? i.construction.value : ''} ${i.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''}`;
  };




  const a = Object.values(groupBy(data.part_list, (x) => x?.woodtype?.NAME));
  const b = a
    .map((woodtype) =>
      woodtype.map((v, i) => ({
        ...v,
        dimensions: flatten(
          v.dimensions.map((d, k) => ({
            ...d,
            name: getName(v),
            construction: v.construction,
            profile: v.profile,
            design: v.design,
            orderType: v.orderType,
          }))
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
    HeightSort(GlassSort(i)).forEach((item, index) => {

      if (
        // item.glass_index === 1 ||
        item.construction.value === 'Slab' ||
          i.orderType.value === 'One_Piece' ||
          i.orderType.value === 'One_Piece_DF' 
      ) {
        return null;
      } else {

        

        const n = {
          ...i,
          construction: item.construction,
          profile: item.profile,
          design: item.design
        };

        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          {
            text: item.name,
            style: 'fonts',
          },
          {
            text: (Stiles(item, n, breakdowns) || []).map((stile) => {
              return `${stile.qty} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Stiles(item, n, breakdowns) || []).map((stile) => {
              return `${stile.measurement} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Stiles(item, n, breakdowns) || []).map((stile) => {
              return `${stile.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text: item.notes ? item.notes.toUpperCase() : '',
            style: 'fonts',
          },
        ]);
      }
    });


    return [
      index === 0 && data.job_info?.Shop_Notes
        ? {
          columns: [
            { text: '' },
            {
              text: `${
              data.job_info?.Shop_Notes
                ? data.job_info?.Shop_Notes?.toUpperCase()
                : ''
              }`,
              alignment: 'center',
              style: 'fontsBold',
            },
            { text: '' },
          ],
          margin: [0, -29, 0, 0],
        } : null,
      {
        margin: [0, 10, 0, 0],
        columns: [
          {
            text: `${i.thickness?.grade_name ? i.thickness?.grade_name : ''}${
              i.woodtype.NAME
            } - ${i.thickness.thickness_1} - ${i.thickness.thickness_2}"`,
            style: 'woodtype',
            width: 200,
          },
          {
            text: `IP: ${i.profile ? i.profile.NAME : i.design ? i.design.NAME : 'None'}`,
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
        text: '==============================================================================',
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
        text: '==============================================================================',
        alignment: 'center',
      },

      // { text: '', pageBreak: 'before' }
    ];
    
  });

  // const table_body = [];

  return [
    
    table_body,
  ];
};

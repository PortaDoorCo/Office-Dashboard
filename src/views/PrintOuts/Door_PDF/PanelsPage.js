import { flatten, groupBy } from 'lodash';
import Panels from '../Breakdowns/Doors/Panels/Panels';
import GlassSort from '../Sorting/GlassSort';
import HeightSort from '../Sorting/HeightSort';

export default (data, breakdowns, type) => {
  const getName = (i) => {
    return `${
      i.construction.value === 'Slab'
        ? 'Slab'
        : i.design
        ? i.design.NAME
        : i.face_frame_design
        ? i.face_frame_design.NAME
        : ''
    } ${
      i.construction.value === 'MT' || i.construction.value === 'Miter'
        ? i.construction.value
        : ''
    } ${i.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''}`;
  };

  const a = Object.values(groupBy(data.part_list, (x) => x?.woodtype?.NAME));

  const b = a
    .map((woodtype) =>
      woodtype.map((v, i) => {
        return {
          ...v,
          dimensions: flatten(
            v.dimensions.map((d, k) => ({
              ...d,
              name: getName(v),
            }))
          ),
        };
      })
    )
    .map((t, x) => {
      return {
        ...t[0],
        dimensions: flatten(t.map((c) => c.dimensions)),
      };
    });

  const table_body = b.map((i, index) => {
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

    HeightSort(GlassSort(i)).forEach((item, index) => {
      if (
        item.glass_index === 1 ||
        i.orderType.value === 'One_Piece' ||
        i.orderType.value === 'One_Piece_DF'
      ) {
        return null;
      } else {
        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          {
            text: item?.construction?.value === 'Slab' ? 'Slab' : item.name,
            style: 'fonts',
          },
          {
            text: (Panels(item, i, breakdowns) || []).map((panel) => {
              return `${panel.qty} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Panels(item, i, breakdowns) || []).map((panel) => {
              return `${panel.measurement} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Panels(item, i, breakdowns) || []).map((panel) => {
              return `${panel.pattern} \n`;
            }),
            style: 'fonts',
          },
          {
            text: i.design && i.design.TOP_RAIL_ADD > 0 ? i.design.NAME : '',
            style: 'fonts',
          },
          {
            text: (Panels(item, i, breakdowns) || []).map((panel) => {
              return `${panel.panel} \n`;
            }),
            style: 'fonts',
          },
          item.notes || item.lite
            ? {
                text: `${item.notes ? item.notes : ''} ${
                  item.lite ? item.lite.NAME : ''
                }`,
                style: 'tableBold',
                alignment: 'left',
              }
            : null,
        ]);
      }
    });

    return [
      index === 0
        ? {
            columns: [
              { text: '' },
              {
                alignment: 'center',
                style: 'fontsBold',
                stack: [
                  data.job_info?.Shop_Notes
                    ? {
                        text: `${
                          data.job_info?.Shop_Notes
                            ? data.job_info?.Shop_Notes?.toUpperCase()
                            : ''
                        }`,
                      }
                    : null,
                  {
                    text: data.misc_items.map((i) => {
                      if (i.category === 'preselect') {
                        if (i.item.NAME.includes('Delivery')) {
                          return null;
                        } else {
                          return `${i.item?.NAME} \n`;
                        }
                      } else {
                        return `${i.item2} \n`;
                      }
                    }),
                  },
                ],
              },
              { text: '' },
            ],
            margin: [0, -21, 0, 0],
          }
        : null,
      {
        margin: [0, 10, 0, 0],
        stack: [
          {
            columns: [
              {
                text: `${
                  i.thickness?.grade_name ? i.thickness?.grade_name : ''
                }${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${
                  i.thickness.thickness_2
                }"`,
                style: 'woodtype',
                alignment: 'left',
                width: 150,
              },

              {
                text: `IP:  ${
                  i.construction?.value === 'Slab'
                    ? 'None'
                    : (i.construction === 'Cope' ||
                        i.design?.NAME?.includes('PRP 15') ||
                        i.design?.NAME?.includes('PRP15')) &&
                      i.profile
                    ? i.profile.NAME
                    : i.design
                    ? i.design.NAME
                    : 'None'
                }`,
                style: 'woodtype',
                alignment: 'center',
              },
              i.construction.value === 'Slab'
                ? {
                    text: `Edge: ${i.edge?.NAME}`,
                    style: 'woodtype',
                    alignment: 'center',
                  }
                : null,
              {
                text: `${
                  i.construction.value === 'Slab'
                    ? i.woodtype?.FRAMING_MATERIAL
                      ? i.woodtype?.FRAMING_MATERIAL
                      : i.woodtype?.NAME
                    : i.woodtype?.PANEL_MATERIAL
                    ? i.woodtype?.PANEL_MATERIAL
                    : i.woodtype?.NAME
                } ${type}`,
                alignment: 'right',
                style: 'woodtype',
              },
            ],
          },
          i.applied_profile && i.applied_profile.NAME !== 'None'
            ? {
                text: `${
                  i.applied_profile && i.applied_profile.NAME !== 'None'
                    ? i.applied_profile.NAME.toUpperCase()
                    : ''
                }`,
                style: 'headerFont',
                alignment: 'center',
                margin: [0, 10, 0, 0],
              }
            : null,
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
          widths: [22, 50, 20, 80, 25, 30, '*', '*'],
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

  return [table_body];
};

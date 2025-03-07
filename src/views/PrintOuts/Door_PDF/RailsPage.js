import { flatten, groupBy } from 'lodash';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import GlassSort from '../Sorting/GlassSort';
import RailSort from '../Sorting/RailSort';

export default (data, breakdowns) => {
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
      woodtype.map((v, i) => ({
        ...v,
        dimensions: flatten(
          v.dimensions.map((d, k) => ({
            ...d,
            name: getName(v),
          }))
        ),
      }))
    )
    .map((t, x) => ({
      ...t[0],
      dimensions: flatten(t.map((c) => c.dimensions)),
    }));

  const heightSort = b.map((i, index) => {
    const dim = GlassSort(i).map((item, index) => {
      if (
        // item.glass_index === 1 ||
        item.construction.value === 'Slab' ||
        i.orderType.value === 'One_Piece' ||
        i.orderType.value === 'One_Piece_DF'
      ) {
        return {
          ...item,
          rail_height: 0,
        };
      } else {
        const n = {
          ...i,
          construction: item.construction,
          profile: item.profile,
          design: item.design,
        };

        return {
          ...item,
          rail_height: Rails(item, n, breakdowns).map((rail) => {
            return rail.height;
          })[0],
        };
      }
    });

    return {
      ...i,
      dim,
    };
  });

  const table_body = heightSort.map((i, index) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Length', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Arch', style: 'fonts' },
        { text: 'Note', style: 'fonts' },
      ],
    ];

    RailSort(i.dim).forEach((item, index) => {
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
          design: item.design,
        };

        tableBody.push([
          { text: item.item ? item.item : index + 1, style: 'fonts' },
          {
            text: item.name,
            style: 'fonts',
          },
          {
            text: (Rails(item, n, breakdowns) || []).map((rail) => {
              return `${rail.qty} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Rails(item, n, breakdowns) || []).map((rail) => {
              return `${rail.measurement} \n`;
            }),
            style: 'fonts',
          },
          {
            text: (Rails(item, n, breakdowns) || []).map((rail) => {
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
          {
            text: item.notes ? item.notes.toUpperCase() : '',
            style: 'fonts',
          },
        ]);
      }
    });

    return [
      {
        stack: [
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
                      i.job_notes
                        ? { text: `${i.job_notes.toUpperCase()}` }
                        : null,
                      {
                        text: data.misc_items.map((i) => {
                          if (i.category === 'preselect') {
                            if (
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'delivery'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes('price') ||
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'discount'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes('rush') ||
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'credit'
                              ) ||
                              i?.item?.NAME?.toLowerCase()?.includes(
                                'service charge'
                              )
                            ) {
                              return null;
                            } else {
                              return `${i.item?.NAME} \n`;
                            }
                          } else {
                            if (
                              i?.item2?.toLowerCase()?.includes('delivery') ||
                              i?.item2?.toLowerCase()?.includes('price') ||
                              i?.item2?.toLowerCase()?.includes('discount') ||
                              i?.item2?.toLowerCase()?.includes('rush') ||
                              i?.item2?.toLowerCase()?.includes('credit') ||
                              i?.item2
                                ?.toLowerCase()
                                ?.includes('service charge')
                            ) {
                            } else {
                              return `${i.item2} \n`;
                            }
                          }
                        }),
                      },
                    ],
                  },
                  { text: '' },
                ],
                margin: [0, -29, 0, 0],
              }
            : null,
          {
            margin: [0, 15, 0, 0],
            stack: [
              {
                columns: [
                  {
                    stack: [
                      {
                        text: `${
                          i.thickness?.grade_name ? i.thickness?.grade_name : ''
                        }${i.woodtype.NAME} - ${i.thickness.thickness_1} - ${
                          !i.thickness?.oversize
                            ? i.thickness.thickness_2 + '"'
                            : ''
                        }`,
                        style: 'woodtype',
                        alignment: 'left',
                        width: 150,
                      },

                      i.thickness?.oversize
                        ? {
                            text: `${i.thickness.thickness_2}" - ${i.thickness.thickness_3}"`,
                            style: 'woodtype',
                            alignment: 'left',
                            width: 150,
                          }
                        : null,
                    ],
                  },
                  {
                    text: `IP:  ${
                      i.construction?.value === 'Slab'
                        ? 'None'
                        : (i.construction?.value === 'Cope' ||
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
                  {
                    text: 'RAILS',
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
              widths: [22, 60, 30, 100, 30, 60, '*'],
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
        ],
      },
    ];
  });

  // const table_body = [];

  return [table_body];
};

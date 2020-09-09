
export default (data, edges, moulds, panels, appliedProfiles, breakdowns) => {

  let blob = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAAAAAAZai4+AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkAgYBCi9OVkBsAAACaElEQVR42u3V3XKiMAAF4L7/G5xErYBaq9v6s6OtLlD/ocBDbQCB7Ey7FbgwF+fcSIA5fgYTHhIj83BvAFlkkUUWWWQZErLIIsuEkEUWWSaELLLIMiFkkUWWCSGLLLJMCFlkkWVCyCKLLBNCFllkmRCyyLoD6wXXgz2K+Okwfht05OAtvqm/Ycn3rM9O0bj9pzEa5cej6AZV05JvWeEYReMSIz9PqEYzyNUpeJOY/axqXPI1K5g/SZSNUyy0S4Cbfv6BCP5valPyNWuXT/F1NMCmurRCPz94xKqclB5+ZwcvsOOmJTewouPx6JaNHeyrS8+Y5wdzTMqTLsRRfXzkHw1LfmalORWNIfDx3BP2r3M6srDNT29hVTdPMYiTqH+dtIYl9Vjl0pbv2a/289M+utXNYRfrZJHaWpTUY20A2wsCz84ekcAhP32A0O52IV0hTu1KarH812W2u8Q2xkkiq0ap3z5VM7FqW1KHVcZLZ7xfzX9fv6geoxO3LWnEUrtNkAyrf+tQv3gQkJe2JY1YYdo4KbbFJabatchCF08tS+qwYutxW8y4mv91saQttfaqLOCcpb5jNimpNVtjWJ9ZtYPXJLkI7NLRDkJ7Zvt0ga3RCdqU1GOpLcfxgovnoJt2zNDzosTv6W9Z9QgX2VdOWpTUZCUbke+E3ewXRkNAqHfwSFt3c1jp8ld/e7d5SV1Wcp5ZUtqLMB/Fa0dKZ60Vqpfy7srrhU1LbmTdNWSRRZYJIYssskwIWWSRZULIIossE0IWWWSZELLIIsuEkEUWWSaELLLIMiFkkUWWCSGLLLJMCFlkkWVC/gI+i6YMw2buTAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMi0wNlQxMDoxMDo0NyswOTowMEvdSK8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDItMDZUMTA6MTA6NDcrMDk6MDA6gPATAAAAAElFTkSuQmCC';

  const e = edges.length > 0 ? edges : blob;
  const m = moulds.length > 0 ? moulds : blob;
  const p = panels.length > 0 ? panels : blob;
  const a = appliedProfiles.length > 0 ? appliedProfiles : blob;

  return [
    {
      columns: [
        {
          stack: [

            { text: 'Profiles', bold: true },
          ]
        },
        {
          stack: [

            { text: 'Porta Door Co. Inc.', alignment: 'center' },
          ]
        },
        {
          stack: [
            { text: `Order #: ${data.orderNum}`, alignment: 'right' },
          ]
        }
      ]
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
    },
    data.part_list.map((i, index) => {
      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `Edge: ${i.edge ? i.edge.NAME : 'None'}`,
                  style: 'fonts'
                },
                {
                  image: i.edge ? e : blob,
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
            {
              stack: [
                {
                  text: `Profile: ${i.profile ? i.profile.NAME : 'None'}`,
                  style: 'fonts'
                },
                {
                  image: i.profile ? m : blob,
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
            {
              stack: [
                {
                  text: `Panel: ${i.panel ? i.panel.NAME : 'None'}`,
                  style: 'fonts'
                },
                {
                  image: i.panel ? p : blob,
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
            {
              stack: [
                {
                  text: `Applied Profile: ${i.applied_profile.NAME}`,
                  style: 'fonts'
                },
                {
                  image: i.applied_profile.NAME !== 'None' ? a : blob,
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
          ],

        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }
          ],
          margin: [0, 10, 0, 0]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
        }
      ];
    }),
    { text: '', pageBreak: 'before' }
  ];
};

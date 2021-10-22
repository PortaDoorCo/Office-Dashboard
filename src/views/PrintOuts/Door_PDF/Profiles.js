
export default (data, designs, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns) => {

  let blob = data.part_list.map(i => {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAAACXBIWXMAAC4jAAAuIwF4pT92AAAGhGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDktMTFUMTI6MTA6NTgtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDktMTFUMTI6MTA6NTgtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA5LTExVDEyOjEwOjU4LTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmUzMzBlZTY2LTY0ZDgtNGZlMy1hZjQ5LTg1NGI0MDUxNzBmZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYwODc2NmQ2LWM0Y2UtNjc0Ni04N2UxLTUxYmNkNGMwNDRiNyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmU3ZTY5ZmU4LWVkZmYtNDVlNC05NzlkLTYyYTdkZjk3MzA4YSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTdlNjlmZTgtZWRmZi00NWU0LTk3OWQtNjJhN2RmOTczMDhhIiBzdEV2dDp3aGVuPSIyMDIwLTA5LTExVDEyOjEwOjU4LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTMzMGVlNjYtNjRkOC00ZmUzLWFmNDktODU0YjQwNTE3MGZmIiBzdEV2dDp3aGVuPSIyMDIwLTA5LTExVDEyOjEwOjU4LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJOb25lIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJOb25lIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Dw8PYAAAEsklEQVR4nO3cMUg6fRzH8a8P/81qlOYMxUVwtc0Gm9qUszkouFoSgoi7oVoMbBMaHqFJRJfGi8pN14iGyLqbCtTN0tn/IPnc/05LfeAvH/q8pvp59/PXvVPvNPL0ej0hZP/MegH0fzEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnj/JUylUsFgsNVqjdrUsiyPx1Mul//KwmhcfzwK6/X60dHRrJZC03E+keZyuaurq5kshabzy/6Noigicnp6Go/HZ7QempjzUXhwcFCpVPL5/ExWQ1NwJgyHw9lsdnNz07KsMaeo1Wo7OzueT7quu/fVdT2VSjk2Xl1dHXVyZFmWfc58Pt/tdif80X6KIRcVW1tbsVjs8PBwnP3L5fLKyoqI/Pvp+fnZ7/fXarWhG2uaFolE+luGQqFkMumuWKvV/H6/fc5CobC+vs6Kw/U+KYqiKEr/a8MwRKRUKvVsTNN0DN7f34tINpvt/UnTNBExTdM+EggEFEXpdDruLZvNpuNeHHM2m81YLKZpWo9chifs9XqqqgYCAfsRdydUFCUWi7kn7XQ6sVhMVdXBSD9VtVp1bNn/JTAMw36/Q+cslUqO2NQ38t0ZXddFJJPJjNqg1WoVi8Xt7W33TV6vd2NjI5fL2d8oCAQC0WjUsWX/CfP19XUwZy6XGzpnMBgUkZeXl1Hr+bF+jbrB5/OdnJwkk8m1tTX3oReRu7s7+TyybqFQSEQajYbP5xt/Nf1CDw8P7+/vjpva7baIvL29jT/bDzEyoYgkEglFUTRNu729dd/aP8pzc3ND911cXBSRTqcz0Wo+Pj5E5Pj4eKK9frhv3uaeyWWi/TzIIZFI/M2VQPgm4ReXiQsLCzL6cdZoNGT0Y3SU+fn5wb40pu8/bBp1mRiJRETk6elp6F6Pj4/y+XQ6vuXlZeEL3oS+T+j1evf394vF4uXlpX3c5/MpinJ+fu7epdvtFgoFVVUnOpf5ek4aZayPfOPxuKqq6XTaMb67u1upVM7OzhzjmUymUqns7e1NsaD+q697zlarxY9QhvrqjNRO1/Xr6+t6vW4fjEajpVIpmUxaltV/XhWRm5ubYrFoGMbS0tIUCwqHw+452+12Op1WVZUfobiNm3BwmegYTyQS1Wq1UChsbm72RzRNM01zun6DOU3TvLi4GMypqqphGOw3lKfHf+wMjn/+BI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4TEhPCaEx4TwmBAeE8JjQnhMCI8J4f0GRst9Gv7su2MAAAAASUVORK5CYII=';
  });
  

  const e = edges;
  const m = moulds;
  const md = miter;
  const mtd = mt;
  const p = panels;
  const a = appliedProfiles;

  const d = designs;

  
  
  

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
                  image: i.edge && e[index] ? e[index] : blob[index],
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
            {
              stack: [
                {
                  text: `Profile: ${i.profile ? i.profile.NAME : i.design ? i.design.NAME  : 'None'}`,
                  style: 'fonts'
                },
                {
                  image: i.profile ? m[index] : i.design && d[index] ? d[index] : blob[index],
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
                  image: i.panel && p[index] ? p[index] : blob[index],
                  width: 100,
                  height: 100,
                  fit: [100, 100]
                }

              ]
            },
            {
              stack: [
                {
                  text: `Applied Profile: ${i.applied_profile ? i.applied_profile.NAME : 'None'}`,
                  style: 'fonts'
                },
                {
                  image: i.applied_profile && a[index]  ? a[index] : blob[index],
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
    // { text: '', pageBreak: 'before' }
  ];
};

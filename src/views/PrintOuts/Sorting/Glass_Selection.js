import GlassCheck from './GlassCheck';

export default (data, type) => {
  let array = [];

  const start = data.part_list
    .map((i) => {
      const glass_check = i.dimensions.map((j) => {
        return GlassCheck(j);
      });

      let glass_dimensions = [];

      const dimensions = glass_check
        .map((g, k) => {
          if (g.glass_index === 1) {
            glass_dimensions.push({ ...g });
            return null;
          } else {
            return { ...g };
          }
        })
        .filter((n) => n);

      if (glass_dimensions.length > 0) {
        let no_panel = { ...i, panel: { NAME: 'Glass', UPCHARGE: 0 } };
        if (i.panel.NAME === 'Louver') {
          no_panel = {
            ...i,
            panel: { NAME: 'Glass', UPCHARGE: 0, louver: true },
          };
        }

        let newObj = { ...no_panel, dimensions: glass_dimensions };
        if (type !== 'Page') {
          array.push(newObj);
        } else {
          array.push([newObj]);
        }
      }

      if (dimensions.length > 0) {
        return { ...i, dimensions };
      } else {
        return null;
      }
    })
    .filter((n) => n);

  const returnValue = [...array, start];

  if (type !== 'Page') {
    return array.concat(start);
  } else {
    return returnValue;
  }
};

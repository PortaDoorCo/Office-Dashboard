import GlassCheck from './GlassCheck';

export default (data) => {
  let array = [];

  const start = data.part_list
    .map((i) => {
      const glass_check = i.dimensions.map((j) => {
        return GlassCheck(j);
      });

      const dimensions = glass_check
        .map((g) => {
          if (g.glass_index === 1) {
            let dimensions = [];
            dimensions.push(g);
            let no_panel = { ...i, panel: { NAME: 'Glass', UPCHARGE: 0 } };
            let newObj = { ...no_panel, dimensions };
            array.push(newObj);
            return null;
          } else {
            return g;
          }
        })
        .filter((n) => n);

      console.log({ dimensions });
      if (dimensions.length > 0) {
        return { ...i, dimensions };
      } else {
        return null;
      }
    })
    .filter((n) => n);

  return array.concat(start);
};

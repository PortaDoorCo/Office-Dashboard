import GlassCheck from './GlassCheck';

export default (data) => {
  let array = [];

  const start = data.part_list
    .map((i) => {
      const glass_check = i.dimensions.map((j) => {
        return GlassCheck(j);
      });

      let glass_dimensions = [];

      const dimensions = glass_check
        .map((g) => {
          if (g.glass_index === 1) {
            glass_dimensions.push(g);
            return null;
          } else {
            return g;
          }
        })
        .filter((n) => n);


      if(glass_dimensions.length > 0){
        let no_panel = { ...i, panel: { NAME: 'Glass', UPCHARGE: 0 } };
        let newObj = { ...no_panel, dimensions: glass_dimensions };
        array.push(newObj);
      }


      console.log({ dimensions });
      if (dimensions.length > 0) {
        return { ...i, dimensions };
      } else {
        return null;
      }
    })
    .filter((n) => n);

  console.log({array});
  console.log({start});

  return array.concat(start);
};

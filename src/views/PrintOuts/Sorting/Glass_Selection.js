import GlassCheck from './GlassCheck';

export default (data) => {
  let array = [];

  console.log({ part_list: data.part_list });

  const start = data.part_list.map((i) => {
    const glass_check = i.dimensions.map((j) => {
      return GlassCheck(j);
    });

    const dimensions = glass_check
      .map((g) => {
        if (g.glass_index === 1) {
          let dimensions = [];
          dimensions.push(g);
          const no_panel = { ...i, panel: { NAME: 'Glass' } };
          const newObj = { ...no_panel, dimensions };
          array.push(newObj);
          return null;
        } else {
          return g;
        }
      })
      .filter((n) => n);

    return { ...i, dimensions };
  });

  return array.concat(start);
};

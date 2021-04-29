const GlassCheck = (i) => {
  const a = Array.from(Array(parseInt(i.panelsH)).keys())
    .map((i, v) => {
      return `glass_check_${i}`;
    });

  const isGlass = a.map(j => i.hasOwnProperty(j)).includes(true);

  return {
    ...i,
    isGlass
  };
};

export default GlassCheck;
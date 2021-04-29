const GlassCheck = (i) => {
  const a = Array.from(Array(parseInt(i.panelsH)).keys())
    .map((i, v) => {
      return `glass_check_${i}`;
    });

  const isGlass = a.map(j => i.hasOwnProperty(j)).includes(true);
     
  if(isGlass){
    return {
      ...i,
      isGlass: true
    };
  } else {
    return {
      ...i,
      isGlass: false
    };
  };
};

export default GlassCheck;
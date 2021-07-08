const GlassCheck = (i) => {

  const panelH = i.panelsH ? parseInt(i.panelsH) : 0;

  const a = Array.from(Array(panelH).keys())
    .map((i, v) => {
      return `glass_check_${v}`;
    });

  const checker = arr => arr.every(v => v === true);
  const glassPanels = a.map(j => i[j]);


  const hasGlass = glassPanels.includes(true);
  
  const multiGlass = glassPanels.length > 1 ? !checker(glassPanels) : false;

  if(hasGlass && !multiGlass){
    return {
      ...i,
      hasGlass,
      multiGlass,
      glass_index: 1
    };
  } else if (hasGlass && multiGlass){
    return {
      ...i,
      hasGlass,
      multiGlass,
      glass_index: 2
    };
  } else {
    return {
      ...i,
      hasGlass,
      multiGlass,
      glass_index: 3
    };
  }
};

export default GlassCheck;
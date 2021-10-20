const GlassCheck = (i) => {

  if(i.construction.value === 'Slab'){
    return {
      ...i,
      hasSlab: true,
    };
  } else {
    return {
      ...i,
      hasSlab: false
    };
  }
  
};
  
export default GlassCheck;
  
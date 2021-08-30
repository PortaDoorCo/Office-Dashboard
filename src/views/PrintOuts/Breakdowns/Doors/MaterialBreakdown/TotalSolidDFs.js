import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.part_list.map(item => {
    let sum = [0];

    if(item.construction?.value === 'Slab'){
      sum = item.dimensions.map(i => {
        return parseInt(i.qty);
      });
    }
    
    return sum;
  });
  const a = calc.map(i => (
    i.reduce((acc, item) => acc + item)
  ));
  //   return sum.toFixed(2);

  const sum = a.reduce((acc, item) => acc + item);
  return sum;
};

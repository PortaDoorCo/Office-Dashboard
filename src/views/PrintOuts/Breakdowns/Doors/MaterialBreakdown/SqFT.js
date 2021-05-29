  
import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.part_list.map(item => {
    const calc2 = item.dimensions.map(i => {
      return ((numQty(i.width) * numQty(i.height)) * parseFloat(i.qty)) / 12;
    });
    const calc_total = calc2.reduce((acc, item) => acc + item);
    return calc_total / 12;
  });

  return calc.reduce((acc, item) => acc + item).toFixed(2);

};